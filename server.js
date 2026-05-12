const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {

  try {

    const { text, ai } = req.body;

    if (!text || !text.trim()) {

      return res.status(400).json({
        error: "請輸入文章內容"
      });

    }

    // AI 模型切換
    const model = ai || "gpt-4.1-mini";

    const response = await client.chat.completions.create({

      model: model,

      messages: [

        {
          role: "system",

          content: `
你是一個專業新聞摘要助手。

請使用繁體中文摘要新聞。

規則：

1. 使用 1. 2. 3. 條列格式
2. 每點一句話
3. 保留重要人物、時間、地點、事件
4. 不要重複內容
5. 內容精簡
6. 不要加入個人評論
7. 每點控制在50字內
`
        },

        {
          role: "user",
          content: text
        }

      ],

      temperature: 0.5

    });

    res.json({

      summary:
        response.choices[0].message.content

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error:
        "摘要失敗，請檢查 API Key 或模型設定"

    });

  }

});

app.listen(port, () => {

  console.log(
    `伺服器已啟動：http://localhost:${port}`
  );

});
