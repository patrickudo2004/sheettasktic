import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, databaseId, task } = await request.json();

    if (!token || !databaseId || !task) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: task.title,
                },
              },
            ],
          },
          // We assume the user has a "Notes" or "Description" property, or we just add to the content
          // However, mapping properties is complex. For MVP, we'll just set the title.
          // In a real app, we'd query the DB schema first.
        },
        children: task.content ? [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: task.content,
                  },
                },
              ],
            },
          },
        ] : [],
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Notion API Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
