const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const googleIt = require('google-it');
const { G4F } = require("g4f");
let g4f = new G4F();
const skrep = require('@bochilteam/scraper');
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
async function blackboxAIChat(content) {
    const url = "https://www.blackbox.ai/api/chat"
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "id-ID,en;q=0.5",
        "Referer": "https://www.blackbox.ai/",
        "Content-Type": "application/json",
        "Origin": "https://www.blackbox.ai",
        "Alt-Used": "www.blackbox.ai"
    }

    const data = {
        messages: [{
            role: "user",
            content
        }],
        id: "chat-free",
        previewToken: null,
        userId: "",
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: "You are Dark Box, a useful AI Model for millions of developers using Blackbox Code Chat that will answer coding questions and help them when writing code.",
        maxTokens: 1024,
        webSearchMode: false,
        promptUrls: "",
        isChromeExt: false,
        githubToken: null
    }

    try {
        const blackboxResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })

        const blackboxData = await blackboxResponse.text()
        return blackboxData
    } catch (error) {
    throw error;
  }
}

// Fungsi untuk GPT4
async function chat(prompt) {
	try {
  const messages = [
    { role: "asistant", content: "Kobo Kanaeru adalah bot WhatsApp yang terbuat dari Nodejs. Untuk membantu anda dalam mengerjakan dalam hal apapun. Karakter Kobonaeru adalah periang dan asik, Kobo Kanaeru diciptakan oleh MannHost atau Hyugimura, usia pencipta Kobo Kanaeru adalah 16tahun, dan pencipta Kobo Kanaeru tinggal di Kota Pekanbaru" },
    { role: "user", content: prompt }
  ];
  let res = await g4f.chatCompletion(messages)
  return  res
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk AIGPT
async function aigpt(prompt) {
  try {
   const response = await axios.get("https://tools.revesery.com/ai/ai.php?query=" + prompt, {
     headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
      }
    });
    const res = response.data
    const result = res.result
    return result
  } catch (error) {
  console.error(error)
  }
}

// Fungsi untuk ttdl
async function tiktok(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let t = await axios("https://lovetik.com/api/ajax/search", { method: "post", data: new URLSearchParams(Object.entries({ query: url })) });

      const result = {};
      result.title = clean(t.data.desc);
      result.author = clean(t.data.author);
      result.nowm = await shortener((t.data.links[0].a || "").replace("https", "http"));
      result.watermark = await shortener((t.data.links[1].a || "").replace("https", "http"));
      result.audio = await shortener((t.data.links[2].a || "").replace("https", "http"));
      result.thumbnail = await shortener(t.data.cover);
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Fungsi untuk ttdl2
async function tiktokv2(url) {
    const urls = { url };
    try {
        const response = await axios.post('https://ssstiktokio.com/wp-json/aio-dl/video-data/', urls, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
            }
        });
        const data = response.data;
        const result = {
            data: data,
        };

        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

// Funsi untuk mediafire
async function mediafire(url) {
	let res = await axios.get(url)
	let get = cheerio.load(res.data)
	let urlFile = get('a#downloadButton').attr('href')
	let sizeFile = get('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('', '')
	let split = urlFile.split('/')
	let nameFile = split[5]
	mime = nameFile.split('.')
	mime = mime[1]
	let result = {
		title: nameFile,
		size: sizeFile,
		url: urlFile
	}
	return result
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
app.get('/api/ai/ragbot', async (req, res) => {
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
app.get('/api/ai/degreeguru', async (req, res) => {
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

// Endpoint untuk aigpt
app.get('/api/ai/aigpt', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await aigpt(message);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk fbdl
app.get('/api/downloader/fbdl', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    const result = await skrep.savefrom(url);
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk igdl
app.get('/api/downloader/igdl', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var dld = await skrep.instagramdl(url).catch(async _ => await skrep.instagramdlv2(url)).catch(async _ => await skrep.instagramdlv3(url)).catch(async _ => await skrep.instagramdlv4(url))
    const result = dld;
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk ttdl
app.get('/api/downloader/ttdl', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var dld = await tiktok(url)
    const result = dld;
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk ttdlv2
app.get('/api/downloader/ttdlv2', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var anu = await tiktokv2(url)
    const result = anu;
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk mediafire
app.get('/api/downloader/mediafire', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    var anu = await mediafire(url)
    const result = anu;
    res.status(200).json({
      status: 200,
      creator: "MannR",
      result
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

// Endpoint untuk cosplay
app.get('/api/anime/cosplay', async (req, res) => {
  try {
  	let ano = await axios.get("https://raw.githubusercontent.com/MannOffc/api/main/JSON/manaxu-cosplay.json")
  	let list = ano.data
  	let result = list[Math.floor(list.length * Math.random())]
  	res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk elaina
app.get('/api/anime/elaina', async (req, res) => {
  try {
  	let ano = await axios.get("https://raw.githubusercontent.com/MannOffc/api/main/JSON/manaxu-elaina.json")
  	let list = ano.data
  	let result = list[Math.floor(list.length * Math.random())]
  	res.status(200).json({
      status: 200,
      creator: "MannR",
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.result });
  }
});

// Endpoint untuk google
app.get('/api/internet/google', async (req, res) => {
  try {
  const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
  let url = 'https://google.com/search?q=' + encodeURIComponent(message)
  let search = await googleIt({ query: message })
  const result = search.map(item => {
        return { title: item.title,
url: item.link,
snippet: item.snippet }
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
