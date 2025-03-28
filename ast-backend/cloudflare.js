async function sendMessageToCloudflare(model, input) {
  console.log(
    process.env.CLOUDFLARE_WORKER_ACCOUNT_ID,
    process.env.CLOUDFLARE_WORKER_API_TOKEN,
    process.env.CLOUDFLARE_WORKER_MODEL
  );
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_WORKER_ACCOUNT_ID}/ai/run/${model}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(input),
    }
  );

  const result = await response.json();
  console.log(result);
  return result;
}

module.exports = { sendMessageToCloudflare };
