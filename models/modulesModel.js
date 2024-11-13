class Module {
    constructor(id, name, description, access, link, gh_page, owner, repo) {
      (this.id = id),
        (this.name = name),
        (this.description = description),
        (this.access = access),
        (this.link = link),
        (this.gh_page = gh_page),
        (this.owner = owner),
        (this.repo = repo);
    }
  }
  
  export default Module;