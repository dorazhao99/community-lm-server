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

export function interpretMarkdown(markdown) {
    const match = markdown.match(/^#\s(.+)/m);
    const firstHeading = match ? match[1] : null;
    return firstHeading
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