const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const rentalsFile = path.join(__dirname, '..', 'data', 'rentals.json');
const equipmentFile = path.join(__dirname, '..', 'data', 'equipment.json');

async function readJSON(file) {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/rentals (All active & completed rentals)
router.get('/', async (req, res) => {
  try {
    const rentals = await readJSON(rentalsFile);
    res.status(200).json({ success: true, count: rentals.length, data: rentals });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not read rentals' });
  }
});

// POST /api/rentals (Create a new booking)
router.post('/', async (req, res) => {
  try {
    const { equipmentId, customerName, customerEmail, customerPhone, startDate, rentalDays } = req.body;
    
    // Strict field validation (Session 32 & 45)
    if (!equipmentId || !customerName || !customerEmail || !customerPhone || !startDate || !rentalDays) {
      return res.status(400).json({ success: false, message: 'All booking fields are required' });
    }

    const equipments = await readJSON(equipmentFile);
    const eqIdx = equipments.findIndex(e => e.id === parseInt(equipmentId));
    if (eqIdx === -1) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipments[eqIdx].status === 'Rented') {
      return res.status(400).json({ success: false, message: 'Item is currently rented by someone else' });
    }

    const rentals = await readJSON(rentalsFile);
    const totalCost = equipments[eqIdx].dailyRate * Number(rentalDays);

    const newBooking = {
      id: rentals.length > 0 ? Math.max(...rentals.map(r => r.id)) + 1 : 101,
      equipmentId: parseInt(equipmentId),
      equipmentName: equipments[eqIdx].name,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      rentalDays: Number(rentalDays),
      totalCost,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Update equipment status to Rented
    equipments[eqIdx].status = 'Rented';
    rentals.push(newBooking);

    await writeJSON(rentalsFile, rentals);
    await writeJSON(equipmentFile, equipments);

    res.status(201).json({ 
      success: true, 
      message: 'Rental booked successfully!', 
      data: newBooking 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while booking' });
  }
});

// PUT /api/rentals/:id/return (Return equipment)
router.put('/:id/return', async (req, res) => {
  try {
    const rentals = await readJSON(rentalsFile);
    const rIdx = rentals.findIndex(r => r.id === parseInt(req.params.id));
    if (rIdx === -1) {
      return res.status(404).json({ success: false, message: 'Rental record not found' });
    }

    rentals[rIdx].status = 'Returned';
    rentals[rIdx].returnedAt = new Date().toISOString();

    // Mark equipment back to Available
    const equipments = await readJSON(equipmentFile);
    const eqIdx = equipments.findIndex(e => e.id === rentals[rIdx].equipmentId);
    if (eqIdx !== -1) {
      equipments[eqIdx].status = 'Available';
      await writeJSON(equipmentFile, equipments);
    }

    await writeJSON(rentalsFile, rentals);

    res.status(200).json({ success: true, message: 'Equipment returned successfully', data: rentals[rIdx] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process return' });
  }
});

module.exports = router;
