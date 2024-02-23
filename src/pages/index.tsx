import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import {
  TextInput,
  Container,
  Stack,
  Loader,
  LoadingOverlay,
  Paper,
  Card,
  Button,
  Text
} from "@mantine/core";

const openAiAPI = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export default function Home() {
  const [question, setQuestion] = useState("");
  const [allAnswers, setAllAnswer] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  

  const handleQuestionChange = (e: any) => {
    setQuestion(e.target.value);
  };

  const askQuestion = async () => {
    let url = "https://api.openai.com/v1/chat/completions";
    let token = `Bearer ${openAiAPI}`;
    let model = "gpt-3.5-turbo";

    let messagesToSend = [
      ...allAnswers,
      {
        role: "user",
        content: question,
      },
    ];
    setLoading(true);

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: messagesToSend,
        }),
      });
      let resjson = await response.json();
      if (resjson) {
        console.log("response json", resjson);
        setLoading(false);
        let newAllMessages = [...messagesToSend, resjson?.choices[0].message];
        setAllAnswer(newAllMessages);
      }
    } catch (error) {
      setLoading(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container size="lg">
        <h1>ChatGPT Integration</h1>
        <Card radius="md" withBorder>
            <div>
              <TextInput
                label="Ask a question"
                description="Type a question"
                onChange={handleQuestionChange}
                value={question}
                pb="md"
              />
            </div>
            <Button mb="lg" variant="filled" fullWidth onClick={askQuestion} disabled={loading}>
              Ask
            </Button>
          {loading && <Loader color="blue" />}
          {allAnswers && allAnswers?.length > 0 && (
            <Paper shadow="xs" p="lg">
              <div>
                <Text size="xl" fw={700}>Answer: </Text>
                <div>
                  {allAnswers.map((msg, index) => (
                    <div key={index}>
                      <div>
                        <h4>{msg.role === "user" ? "You" : "ChatGPT"}</h4>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          )}
        </Card>
      </Container>
    </div>
  );
}
