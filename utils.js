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

export function checkRepo(repo) {
    const result = repo.split("/");
    const owner = result[result.length - 2]
    const repoName = result[result.length - 1]
    return {
        owner: owner, 
        repo_name: repoName
    }
}