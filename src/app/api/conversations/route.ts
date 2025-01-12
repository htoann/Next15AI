import Conversation from '@/lib/api-models/Conversation';
import connect from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  await connect();

  switch (req.method) {
    case 'GET':
      try {
        const conversations = await Conversation.find();
        return NextResponse.json(conversations);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
      }

    case 'POST':
      try {
        const { user, title } = await req.json();
        const newConversation = new Conversation({
          user,
          title,
        });
        await newConversation.save();
        return NextResponse.json(newConversation, { status: 201 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as POST, handler as GET };
