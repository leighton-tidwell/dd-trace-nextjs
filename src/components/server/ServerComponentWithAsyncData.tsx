// Server component that fetches data asynchronously
import styles from "./ServerComponentWithAsyncData.module.css";

// Simulate a database or API call
async function fetchData() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock data
  return [
    {
      id: 1,
      title: "First Post",
      content: "This is the first post content",
      author: "Alice",
      date: "2023-10-15",
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the second post content",
      author: "Bob",
      date: "2023-10-16",
    },
    {
      id: 3,
      title: "Third Post",
      content: "This is the third post content",
      author: "Charlie",
      date: "2023-10-17",
    },
    {
      id: 4,
      title: "Fourth Post",
      content: "This is the fourth post content",
      author: "David",
      date: "2023-10-18",
    },
    {
      id: 5,
      title: "Fifth Post",
      content: "This is the fifth post content",
      author: "Eve",
      date: "2023-10-19",
    },
  ];
}

// Process the data with a simulated heavy computation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processData(data: any[]) {
  // Simulate a CPU-intensive task
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Process the data
  return data.map((item) => ({
    ...item,
    wordCount: item.content.split(" ").length,
    titleLength: item.title.length,
    processed: true,
    summary: item.content.substring(0, 20) + "...",
  }));
}

export default async function ServerComponentWithAsyncData() {
  // Fetch data asynchronously
  const data = await fetchData();

  // Process the data
  const processedData = await processData(data);

  // Calculate some statistics
  const totalPosts = processedData.length;
  const totalWords = processedData.reduce(
    (sum, post) => sum + post.wordCount,
    0
  );
  const averageWords = totalWords / totalPosts;
  const uniqueAuthors = new Set(processedData.map((post) => post.author)).size;

  return (
    <div className={styles.server_component_async}>
      <h3>Server Component with Async Data</h3>
      <p>
        This component fetches and processes data asynchronously on the server.
      </p>

      <div className={styles.data_statistics}>
        <h4>Blog Statistics:</h4>
        <ul>
          <li>Total Posts: {totalPosts}</li>
          <li>Total Words: {totalWords}</li>
          <li>Average Words Per Post: {averageWords.toFixed(2)}</li>
          <li>Unique Authors: {uniqueAuthors}</li>
        </ul>
      </div>

      <div className={styles.posts_list}>
        <h4>Blog Posts:</h4>
        {processedData.map((post) => (
          <div key={post.id} className={styles.post}>
            <h5>{post.title}</h5>
            <div className={styles.post_meta}>
              <span>
                By {post.author} on {post.date}
              </span>
              <span>Word Count: {post.wordCount}</span>
            </div>
            <p>{post.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
