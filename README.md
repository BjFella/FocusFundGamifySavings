# Savings Goal Tracker

A modern, responsive savings goal tracking application built with React, TypeScript, and Tailwind CSS. This application helps users set, track, and manage their financial goals with an intuitive interface and beautiful visual design.

## 🚀 Features

- **Goal Management**: Create, view, and delete savings goals
- **Visual Progress Tracking**: Beautiful progress bars and completion indicators
- **Deposit/Withdraw Functionality**: Add or remove funds from your goals
- **Custom Amounts**: Specify exact amounts for deposits and withdrawals
- **Responsive Design**: Works seamlessly on all device sizes
- **Dark Theme**: Modern dark UI with gradient accents
- **Image Integration**: Visual representation of each savings goal
- **Progress Visualization**: Dynamic image effects based on goal completion

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React icons
- **State Management**: React hooks
- **Responsive Framework**: Tailwind CSS utility classes

## 📱 Screenshots

![App Screenshot 1](https://i.imgur.com/2URqsXW.png)
*Main dashboard showing goal cards with progress visualization*

![App Screenshot 2](https://i.imgur.com/AeZCjHG.png)
*Add new goal form with image upload capability*

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 🎨 Design Highlights

- **Dark Theme UI**: Sleek dark interface with purple and green gradient accents
- **Visual Progress Indicators**: Images become more focused as goals progress
- **Responsive Layout**: Adapts to mobile, tablet, and desktop screens
- **Smooth Animations**: Subtle transitions and hover effects
- **Intuitive Controls**: Clear buttons with appropriate icons

## 📝 Usage

### Adding a New Goal
1. Click the "Add New Goal" button
2. Enter goal name and target amount
3. Upload an image or provide an image URL
4. Click "Add Goal" to create your new savings goal

### Managing Goals
- **Deposit Funds**: Click the "Deposit" button on any goal card to add money
- **Withdraw Funds**: Click the "Withdraw" button on any goal card to remove money
- **Delete Goals**: Click the trash icon on any goal card to remove it
- **View Progress**: See visual progress bars and completion status

### Custom Amounts
When depositing or withdrawing, you can specify exact amounts:
1. Click "Deposit" or "Withdraw" button
2. Enter the amount in the input field
3. Click "Confirm" to process the transaction

## 📁 Project Structure

```
src/
├── components/
│   ├── GoalCard.tsx          # Individual goal card component
│   └── AddGoalForm.tsx       # Form for adding new goals
├── pages/
│   └── Index.tsx             # Main application page
├── App.tsx                   # Main application component
└── index.css                 # Global styles
```

## 🎯 How It Works

The application uses a card-based interface where each savings goal is represented as a card. Key features include:

- **Progress Visualization**: Images become less blurry and less grayscale as goals progress
- **Completion Indicators**: Goals show "COMPLETED!" when target amount is reached
- **Interactive Controls**: Deposit and withdraw buttons allow direct fund management
- **Responsive Design**: Adapts to any screen size with mobile-first approach

## 🚨 Requirements

- Node.js (v16 or higher)
- npm or yarn package manager

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- UI components from shadcn/ui
- Icons from Lucide React
- Inspired by modern financial tracking applications

## 📞 Support

For support, issues, or feature requests, please open an issue on the GitHub repository.

---

*Made with ❤️ using React, TypeScript, and Tailwind CSS*