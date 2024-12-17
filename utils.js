export async function getGithubToken(db, uid)  {
    try {
        if (uid) {
            const userRef = db.collection('users').doc(uid)
            const user = await userRef.get();
            if (user.empty) {
                console.log('No user exists')
                return {}
            } else {
                const userData = user.data()
                return userData
            }
        } else {
            return {}
        }
    } catch {
        console.log('Error getting user')
        return {}
    }
}

function checkDetails(markdown) {
    let info = {description: '', slug: ''}
    // Function to extract the table under "## Details"
    const detailsSectionRegex = /## Details([\s\S]*?)(?:\n##|\n$)/;
    const tableRegex = /\|(.+?)\|(?:\r?\n|\r)\|[-\s|]+(?:\r?\n|\r)((?:\|.+?\|(?:\r?\n|\r))+)/;
  
    // Extract the content under the "## Details" heading
    const detailsSectionMatch = markdown.match(detailsSectionRegex);
    if (!detailsSectionMatch) {
      return info
    }
  
    const detailsSection = detailsSectionMatch[1];
    // Extract the table within the "## Details" section
    const tableMatch = detailsSection.match(tableRegex);
    if (!tableMatch) {
      return info
    }
  
    const tableHeader = tableMatch[1].split('|').map((header) => header.trim());
    const tableRows = tableMatch[2]
      .trim()
      .split('\n')
      .map((row) => row.slice(1, row.length - 1).split('|').map((cell) => cell.trim()));
  
    // Convert the table into an array of objects
    tableRows.forEach(row => {
        if (row.length > 1) {
            if (row[0].toLowerCase() === 'description') {
                info['description'] = row[1]
            } else if (row[0].toLowerCase() === 'slug') {
                info['slug'] = row[1]
            }
        }
    })
    console.log(info)
    return info 
}

export function interpretMarkdown(markdown) {
    const match = markdown.match(/^#\s(.+)/m);
    const firstHeading = match ? match[1] : null;
    let info = checkDetails(markdown)
    info = {name: firstHeading, ...info}
    return info
}

export function checkRepo(repo) {
    const updatedLink = repo.replace("https://github.com/", "");
    console.log(updatedLink)
    const result = updatedLink.split("/");
    const owner = result[0]
    const repoName = result[1]
    const fileName = result[result.length-1]
    return {
        owner: owner, 
        repo_name: repoName,
        fileName: fileName
    }
}

export function checkUIDExists(savedModules, uid) {
    for (const doc of savedModules) {
        // Check if the document exists and contains the uid field
        if (doc === uid) {
            return true
        }
    }
    return false // UID not found in any document
  };