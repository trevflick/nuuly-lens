// upload the image to cloudflare worker
// use the returned URL to send to Replicate
// wait for Replicate to return a vector
// log the vector or return it

export async function getImageVector(file) {
  const formData = new FormData()
  formData.append('file', file)

  // upload image to cloudflare 
  // need to do this since replicate model only works with photos hosted online
  const uploadRes = await fetch('https://clip-replica.trevflick.workers.dev/upload', {
    method: 'POST',
    body: formData,
  })

  if (!uploadRes.ok) {
    console.error('Image upload failed')
    return null
  }

  const { url } = await uploadRes.json()

  // start CLIP prediction on replicate
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "cc32f7511d41e74c7fca570932a184fefc5ce4da840771849d25012c7e0021e6", 
      input: {
        image: url
      }
    })
  })

  const prediction = await res.json()

  if (!res.ok || !prediction?.urls?.get) {
    console.error('Replicate prediction failed', prediction)
    return null
  }

  const predictionURL = prediction.urls.get

  // Poll the prediction status until it finishes
  let output = null
  let tries = 10

  while (!output && tries > 0) {
    const statusRes = await fetch(predictionURL, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`
      }
    })

    const statusData = await statusRes.json()

    if (statusData.status === 'succeeded') {
      output = statusData.output
      break
    } else if (statusData.status === 'failed') {
      console.error('CLIP prediction failed', statusData)
      return null
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    tries--
  }

  return output?.embedding ?? null
}
