export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return Response.json([])
  }

  let url = `${supabaseUrl}/rest/v1/quiz_results?select=*&order=percentage.desc,created_at.asc&limit=50`
  if (quizId) {
    url += `&quiz_id=eq.${encodeURIComponent(quizId)}`
  }

  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!res.ok) {
    return Response.json([])
  }

  const data = await res.json()
  return Response.json(data)
}
