export const PERIOD_TIPS = [
  {
    id: 1,
    title: 'Stay Hydrated',
    content: 'Drink plenty of water to help reduce bloating and cramps.',
    icon: 'droplet'
  },
  {
    id: 2,
    title: 'Apply Heat',
    content: 'Use a heating pad on your lower abdomen to alleviate cramps.',
    icon: 'flame'
  },
  {
    id: 3,
    title: 'Light Exercise',
    content: 'Gentle exercise like walking or yoga can help reduce pain and improve mood.',
    icon: 'activity'
  },
  {
    id: 4,
    title: 'Healthy Diet',
    content: 'Eat foods rich in iron and avoid excess salt, caffeine, and sugar.',
    icon: 'apple'
  },
  {
    id: 5,
    title: 'Rest Well',
    content: 'Ensure you get enough sleep as fatigue can worsen symptoms.',
    icon: 'moon'
  },
  {
    id: 6,
    title: 'Pain Relief',
    content: 'Over-the-counter pain relievers can help manage cramps and headaches.',
    icon: 'pill'
  },
  {
    id: 7,
    title: 'Warm Bath',
    content: 'A warm bath can help relax muscles and ease discomfort.',
    icon: 'bath'
  },
  {
    id: 8,
    title: 'Avoid Stress',
    content: 'Practice relaxation techniques like deep breathing or meditation.',
    icon: 'heart'
  },
  {
    id: 9,
    title: 'Track Symptoms',
    content: 'Keep track of your symptoms to better understand your cycle patterns.',
    icon: 'clipboard-list'
  },
  {
    id: 10,
    title: 'Wear Comfortable Clothes',
    content: 'Loose-fitting clothes can help reduce discomfort during your period.',
    icon: 'shirt'
  }
];

export const getRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * PERIOD_TIPS.length);
  return PERIOD_TIPS[randomIndex];
};