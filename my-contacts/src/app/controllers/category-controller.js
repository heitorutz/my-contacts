const CategoryRepository = require('../repository/categories-repository')

class CategoryController {
  async list(req, res) {
    const categories = await CategoryRepository.findAll()
    res.json(categories)
  }

  async create(req, res) {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const category = await CategoryRepository.create({ name })
    res.json(category)
  }
}

module.exports = new CategoryController()