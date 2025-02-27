"use client";

import { useState, useEffect } from "react";
import {
  Text,
  Button,
  Textarea,
  Center,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import NextImage from "next/image";

export default function EinsteinAgent() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState(null) as any;

  const handleGenerateResponse = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/generateText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();

      setResponse(data.response);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/datasource/story");
      const data = await res.json();
      setTransactions(data || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching latest mints:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Center>
      <Flex direction="column" align="center" maxW="450px" overflowY="auto">
        <h1 className="text-4xl font-bold mb-2 text-neon">Yung Einstein</h1>
        <Text
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          className="mb-6 text-gray-400 text-lg italic"
        >
          Decoding Intellectual Property at the Story Protocol
        </Text>

        <Flex
          direction="column"
          height="100%"
          width="100%"
          align="center"
          pr={3}
        >
          <NextImage
            src="/content/images/youngeinstein.gif"
            alt="yungeinstein"
            width="500"
            height="500"
            className="rounded-lg shadow-lg border border-blue-500"
          />
          <TextBubble />
        </Flex>

        <Flex bg="white" p={2} w="100%" h="100%">
          <Textarea
            value={inputText}
            w="100%"
            p="10px" /* Use "p" instead of "padding" */
            m="10px"
            minH="150px"
            borderRadius="md" /* Optional: Adds rounded corners */
            border="1px solid" /* Ensure a visible border */
            borderColor="gray.600" /* Match border color */
            _placeholder={{ color: "gray.400" }} /* Style placeholder text */
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px blue.400",
            }} /* Focus effect */
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about what's going on at Story, blockchain, or IP..."
          />
        </Flex>
        <Button
          w="100%"
          h="100%"
          padding={2}
          onClick={handleGenerateResponse}
          isLoading={isLoading}
          className="btn"
        >
          Send Note To Office
        </Button>

        {response && (
          <Center>
            <Flex direction="column" m="auto">
              <h2 className="text-xl font-semibold mb-2 text-neon">
                Einstein's Response:
              </h2>
              <Text className="text-gray-300">{response}</Text>
            </Flex>
          </Center>
        )}

        <Flex direction="column" h="100%" w="100%">
          <h2>Latest IP Mints</h2>
          {transactions && transactions.length === 0 ? (
            <Text
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              className="text-gray-400"
            >
              No recent mints found.
            </Text>
          ) : (
            <Flex direction="column" gap={10} w="100%">
              {transactions && <Transactions transactions={transactions} />}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}

function shortenText(text: string, startLength = 6, endLength = 4): string {
  if (!text || text.length <= startLength + endLength) return text;
  return `${text.slice(0, startLength)}...${text.slice(-endLength)}`;
}

function Transactions({ transactions }) {
  return (
    <>
      {transactions.assets.map((asset, index) => (
        <Flex direction="column" bg="#000" w="100%" p="10px">
          <Flex justify="center">
            <Box bg="gray.300" sx={{ filter: "invert(1)" }}>
              <NextImage
                src="/content/images/storyLong.png"
                alt="story"
                width={66}
                height={42}
              />
            </Box>
          </Flex>
          <Transaction asset={asset} />
        </Flex>
      ))}
    </>
  );
}

const Transaction = ({ asset }) => {
  const [open, setOpen] = useState(false);
  return (
    <Flex direction="column" p={3} bg="gray.900" borderRadius="md" w="100%">
      {open && asset.metadata && (
        <Flex direction="column" p={3} bg="gray.800" borderRadius="md">
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🏷 <strong>Name:</strong> {asset.metadata.name}
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            📜 <strong>Description:</strong> {asset.metadata.description}
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🔗 <strong>External URL:</strong>{" "}
            <a
              href={asset.metadata.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6" }}
            >
              View Details
            </a>
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🏠 <strong>Token Address:</strong> {shortenText(asset.tokenAddress)}
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🆔 <strong>Token ID:</strong> {asset.tokenId}
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🔄 <strong>Transferable:</strong>{" "}
            {asset.metadata.attributes.find(
              (attr) => attr.traitType === "Transferable"
            )?.value
              ? "Yes"
              : "No"}
          </Text>
          <Text textOverflow="ellipsis" whiteSpace="nowrap">
            🛠 <strong>Licensor:</strong>{" "}
            {shortenText(
              asset.metadata.attributes.find(
                (attr) => attr.traitType === "Licensor"
              )?.value
            )}
          </Text>
        </Flex>
      )}

      <Text
        onClick={() => setOpen(!open)}
        cursor="pointer"
        color="#fff"
        align="center"
        mt={2}
      >
        {open ? "Hide Details" : "More Info"}
      </Text>
    </Flex>
  );
};
function TextBubble() {
  const [thinking, setThinking] = useState(false);
  const [response, setResponse] = useState("");

  // Fetch latest mints on mount
  useEffect(() => {
    async function fetchMints() {
      try {
        await askEinsteinForReview();
      } catch (error) {
        console.error("Error fetching latest mints:", error);
      }
    }
    fetchMints();
  }, []);

  // Send latest mints for Einstein’s review
  const askEinsteinForReview = async () => {
    setThinking(true);

    try {
      const res = await fetch("/api/ai/generateThought", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setThinking(false);
    }
  };
  console.log({ response });
  console.log(response);
  return (
    <Flex
      height="100%"
      width="100%"
      m="auto"
      maxW="200px"
      transform="translate(100px, -400px)"
      right={50}
      alignContent="center"
      zIndex={100}
    >
      <Box
        bg="#ffffff90"
        color="black"
        borderRadius="10px"
        boxShadow="md"
        maxW="300px"
        maxH="300px"
        m="auto"
        p="4"
        overflow="hidden"
        fontSize="sm"
        position="absolute"
      >
        {/* Thinking Animation */}
        {!thinking && (
          <Text fontWeight="bold" fontStyle="italic">
            {response}
          </Text>
        )}

        {/* Small "tail" for the thought bubble */}
        <Box
          position="absolute"
          bottom="-8px"
          left="50%"
          transform="translateX(-50%)"
          width="0"
          height="0"
          borderLeft="8px solid transparent"
          borderRight="8px solid transparent"
          borderTop="8px solid white"
        />
      </Box>
    </Flex>
  );
}
