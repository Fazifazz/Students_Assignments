const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'equipment.json');

// Helper to read equipment asynchronously using fs.promises (Session 43, 44)
async function readEquipment() {
  const data = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(data);
}

// Helper to write equipment asynchronously
async function writeEquipment(items) {
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf8');
}

// GET /api/equipment (Supports ?search= and ?category=) (Session 45)
router.get('/', async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let list = await readEquipment();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve equipment', error: err.message });
  }
});

// GET /api/equipment/categories
router.get('/categories', async (req, res) => {
  try {
    const list = await readEquipment();
    const categories = ['All', ...new Set(list.map(item => item.category))];
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET /api/equipment/:id
router.get('/:id', async (req, res) => {
  try {
    const list = await readEquipment();
    const item = list.find(eq => eq.id === parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/equipment (Create new equipment item)
router.post('/', async (req, res) => {
  try {
    const { name, category, dailyRate, description, location } = req.body;
    if (!name || !category || !dailyRate) {
      return res.status(400).json({ success: false, message: 'Name, category, and dailyRate are required' });
    }

    const list = await readEquipment();
    const newItem = {
      id: list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1,
      name,
      category,
      dailyRate: Number(dailyRate),
      status: 'Available',
      image: req.body.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      description: description || 'Heavy duty rental equipment.',
      serialNumber: req.body.serialNumber || `EQ-${Date.now().toString().slice(-4)}`,
      location: location || 'Main Warehouse',
      rating: 5.0
    };

    list.push(newItem);
    await writeEquipment(list);
    res.status(201).json({ success: true, message: 'Equipment added successfully', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add equipment' });
  }
});

// PUT /api/equipment/:id/status (Update rental status)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const list = await readEquipment();
    const idx = list.findIndex(i => i.id === parseInt(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    list[idx].status = status || list[idx].status;
    await writeEquipment(list);
    res.status(200).json({ success: true, message: 'Status updated', data: list[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// DELETE /api/equipment/:id
router.delete('/:id', async (req, res) => {
  try {
    const list = await readEquipment();
    const idx = list.findIndex(i => i.id === parseInt(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const deleted = list.splice(idx, 1);
    await writeEquipment(list);
    res.status(200).json({ success: true, message: 'Equipment removed', data: deleted[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = router;
