import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
 

export async function GET() {

  const response = await streamText({
    model: mistral('pixtral-12b-2409'),
    messages: [{ 
        role: 'user', 
        content: [
            { type: 'text', text: "What do you see ?" },
            { type: 'image', image: new URL('https://w0.peakpx.com/wallpaper/445/263/HD-wallpaper-crazy-dog-funny-crazy-animals-dogs.jpg') },
          ], }],
  });

  const yes = await response.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });

  return yes
}

// export default pixtralAnswer;