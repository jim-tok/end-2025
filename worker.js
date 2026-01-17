export default {
  async fetch(req) {
    const url = new URL(req.url)
    const sheetURL = "https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv"

    const cache = caches.default
    let res = await cache.match(req)

    if (!res) {
      const data = await fetch(sheetURL).then(r => r.text())
      const rows = data.split("\n").slice(1)

      if (url.pathname === "/api/posts") {
        const posts = rows.map(r => {
          const [slug,title,content,category,date,status] = r.split(",")
          return {slug,title,content,category,date,status}
        }).filter(p => p.status === "publish")

        res = new Response(JSON.stringify(posts), {
          headers: { "Content-Type": "application/json" }
        })
      }

      await cache.put(req, res.clone())
    }
    return res
  }
}

