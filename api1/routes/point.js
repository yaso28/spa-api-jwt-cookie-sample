const express = require('express');
const router = express.Router();

const createMonth = (monthDiff) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + monthDiff);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
};
const getPointList = (user) => {
  return [
    { id: 1, month: createMonth(-3), user_id: user.id, acquired: 12, used: 10, remained: 251 },
    { id: 2, month: createMonth(-2), user_id: user.id, acquired: 11, used: 15, remained: 247 },
    { id: 3, month: createMonth(-1), user_id: user.id, acquired: 14, used: 11, remained: 250 },
  ];
};

router.get('/list', (req, res) => {
  const user = req.user;

  const pointList = getPointList(user);
  const resultList = pointList.map(row => ({ id: row.id, month: row.month }));
  res.json(resultList);
});

router.get('/get/:id', (req, res) => {
  const user = req.user;

  const id = parseInt(req.params.id);
  const pointList = getPointList(user);
  const pointRow = pointList.find(row => row.id === id);

  if (pointRow) {
    res.json(pointRow);
  } else {
    res.status(404).json({
      message: 'Not found.'
    });
  };
});

module.exports = router;
