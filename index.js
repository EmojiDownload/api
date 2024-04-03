const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { G4F } = require("g4f");
let g4f = new G4F();
const app = express();
const PORT = process.env.PORT || 3000;
app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware untuk CORS
app.use(cors());

// Fungsi untuk ragBot
async function ragBot(message) {
  try {
    const response = await axios.post('https://ragbot-starter.vercel.app/api/chat', {
      messages: [{ role: 'user', content: message }],
      useRag: true,
      llm: 'gpt-3.5-turbo',
      similarityMetric: 'cosine'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk degreeGuru
async function degreeGuru(message, prompt) {
  try {
    const response = await axios.post('https://degreeguru.vercel.app/api/guru', {
      messages: [
        { role: 'user', content: message }
      ]
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk pinecone
async function pinecone(message) {
  try {
    const response = await axios.post('https://pinecone-vercel-example.vercel.app/api/chat', {
      messages: [{ role: 'user', content: message }]
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk smartContract
async function smartContract(message) {
  try {
    const response = await axios.post("https://smart-contract-gpt.vercel.app/api/chat", {
      messages: [{ content: message, role: "user" }]
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk blackboxAIChat
async function blackboxAIChat(message) {
  try {
    const response = await axios.post('https://www.blackbox.ai/api/chat', {
      messages: [{ id: null, content: message, role: 'user' }],
      id: null,
      previewToken: null,
      userId: null,
      codeModelMode: true,
      agentMode: {},
      trendingAgentMode: {},
      isMicMode: false,
      isChromeExt: false,
      githubToken: null
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk GPT4
async function chat(prompt) {
  const messages = [
    { role: "asistant", content: "Kobo Kanaeru adalah bot WhatsApp yang terbuat dari Nodejs. Untuk membantu anda dalam mengerjakan dalam hal apapun. Karakter Kobonaeru adalah periang dan asik, Kobo Kanaeru diciptakan oleh MannHost atau Hyugimura, usia pencipta Kobo Kanaeru adalah 16tahun, dan pencipta Kobo Kanaeru tinggal di Kota Pekanbaru" },
    { role: "user", content: prompt }
  ];
  let res = await g4f.chatCompletion(messages)
  return  res
}

// Fungsi untuk igdl
async function igdl(url) {
	try {
            let res = await axios("https://indown.io/");
            let _$ = cheerio.load(res.data);
            let referer = _$("input[name=referer]").val();
            let locale = _$("input[name=locale]").val();
            let _token = _$("input[name=_token]").val();
            let { data } = await axios.post(
              "https://indown.io/download",
              new URLSearchParams({
                link: url,
                referer,
                locale,
                _token,
              }),
              {
                headers: {
                  cookie: res.headers["set-cookie"].join("; "),
                },
              }
            );
            let $ = cheerio.load(data);
            let result = [];
            let __$ = cheerio.load($("#result").html());
            __$("video").each(function () {
              let $$ = $(this);
              result.push({
                type: "video",
                thumbnail: $$.attr("poster"),
                url: $$.find("source").attr("src"),
              });
            });
            __$("img").each(function () {
              let $$ = $(this);
              result.push({
                type: "image",
                url: $$.attr("src"),
              });
            });
          
            return result;
    } catch (error) {
    throw error;
  }
}

// Fungsi untuk ongoing
async function livecharttba() {
	try {
    let { data } = await axios.get('https://www.livechart.me/tba/tv');
    const $ = cheerio.load(data);
    const Result = [];
    $('#content > main > article:nth-child(n)').each((i, e) => {
        const judul = $(e).find('div > h3 > a').text();
        const image = $(e).find('div > div.poster-container > img').attr('src');
        const studio = $(e).find('div > div.anime-info > ul > li > a').text();
        const adaptasi = 'Di adaptasi dari ' + $(e).find('div > div.anime-info > div.anime-metadata > div.anime-source').text();
        const rilisDate = $(e).find('div > div.poster-container > time').text();
        const tags = [];
        $(e).find('div > ol > li:nth-child(n)').each((i, b) => {
            const a = $(b).find('a').text();
            tags.push(a);
        });
        const linkInfo = $(e).find('div > ul > li:nth-child(2) > a').attr('href');
        Result.push({
            judul,
            tags,
            image,
            studio,
            adaptasi,
            rilisDate,
        });
    });
    return Result;
    } catch (error) {
    throw error;
  }
}

// Endpoint untuk servis dokumen HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk ragBot
app.get('/api/ai/ai/ragbot', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ragBot(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk degreeGuru
app.get('/api/ai/ai/degreeguru', async (req, res) => {
  try {
    const { message }= req.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await degreeGuru(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk pinecone
app.get('/api/ai/pinecone', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await pinecone(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk smartContract
app.get('/api/ai/smartcontract', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await smartContract(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk blackboxAIChat
app.get('/api/ai/blackboxAIChat', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await blackboxAIChat(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk gpt4
app.get('/api/ai/gpt4', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await chat(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk instagram
app.get('/api/downloader/igdl', async (req, res, next) => {
  try {
    var url = req.query.url
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const result = await igdl(url);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { result }
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk ongoing
app.get('/api/anime/ongoing', async (req, res) => {
  try {
    const mannr = await livecharttba();
    const result = mannr.map(item => {
        return { title: item.judul,
tags: item.tags.join(', '),
image: item.image,
studio: item.studio,
adaptation: item.adaptasi,
release_date: item.rilisDate }
    });
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Handle 404 error
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Handle error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app
