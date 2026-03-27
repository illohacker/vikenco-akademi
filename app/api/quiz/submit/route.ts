export async function POST(request: Request) {
  const { name, language, quizId, score, total } = await request.json()

  if (!name || !quizId || score === undefined || !total) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Server not configured' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/quiz_results`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name,
      language: language || 'no',
      quiz_id: quizId,
      score,
      total,
    }),
  })

  if (!res.ok) {
    return Response.json({ error: 'Failed to save' }, { status: 502 })
  }

  const data = await res.json()
  return Response.json(data[0])
}
