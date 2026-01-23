import matter from 'gray-matter'
import { marked } from 'marked'

export function parseMarkdown(markdownContent, selectedVolumeIndex) {
  // Convert 0-indexed volume selector to 1-indexed volume number
  const selectedVolume = selectedVolumeIndex + 1
  
  // Parse frontmatter
  const { data, content } = matter(markdownContent)
  
  // Split content by volume headings
  const volumeSections = content.split(/## Volume (\d+)/g)
  
  // Build volume-content map
  const contentByVolume = {}
  for (let i = 1; i < volumeSections.length; i += 2) {
    const volumeNum = parseInt(volumeSections[i])
    const volumeContent = volumeSections[i + 1].trim()
    contentByVolume[volumeNum] = volumeContent
  }
  
  // Get content only up to selected volume
  let displayContent = ''
  for (let v = 1; v <= selectedVolume; v++) {
    if (contentByVolume[v]) {
      displayContent += `## Volume ${v}\n${contentByVolume[v]}\n\n`
    }
  }
  
  return {
    ...data,
    content: displayContent,
    htmlContent: marked.parse(displayContent)
  }
}

export function filterByVolume(items, selectedVolumeIndex) {
  // Convert 0-indexed volume selector to 1-indexed volume number
  const selectedVolume = selectedVolumeIndex + 1
  return items.filter(item => item.introducedInVolume <= selectedVolume)
}
