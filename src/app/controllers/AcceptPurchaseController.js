const Purchase = require('../models/Purchase')

class AcceptPurchaseController {
  async update (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: "This isn't the ad author." })
    }

    if (ad.purchasedBy) {
      return res
        .status(400)
        .json({ error: 'This ad has already been purchased.' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new AcceptPurchaseController()
