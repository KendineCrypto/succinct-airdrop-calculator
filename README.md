# Succinct Airdrop Calculator

A beautiful, responsive React + Tailwind CSS web application for calculating $PROVE token distribution across multiple user groups with customizable percentage allocations.

## ✨ Features

- **Beautiful Modern UI**: Stunning purple/pink gradient theme with glass morphism effects
- **Percentage-Based Input**: Enter total airdrop as percentage of 1 billion $PROVE token supply
- **Group Allocation**: Set percentage allocations for different user groups:
  - Stage 1 — 25,000 users
  - Stage 2 — 3,700 users  
  - Stage 2.5 — 25,000 users
  - Provers — 75 users
  - Discord Roles — 500 users
  - GitHub/Developers — unknown user count
- **Real-time Calculations**: Automatic calculation of tokens per group and per user
- **Smart Validation**: Shows total percentage and warns if over 100%
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Smooth Animations**: Beautiful fade-ins and hover effects using Framer Motion

## 🎨 Design Highlights

- **Color Palette**: Beautiful purple/pink gradients with glass morphism effects
- **Typography**: Modern, clean fonts with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Layout**: Responsive two-column grid that stacks on mobile
- **Interactive Elements**: Enhanced focus states and button animations

## 🚀 Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Vite for fast development

## 📦 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd succinct-airdrop-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 💡 Usage

1. **Enter Airdrop Percentage**: Input the percentage of total $PROVE supply for airdrop (e.g., 5 for 5%)
2. **Set Group Percentages**: For each group, enter the percentage of tokens you want to allocate
3. **Calculate**: Click the "Calculate Distribution" button to see results
4. **Review Results**: View the calculated token distribution for each group

## 🔧 Features in Detail

### Smart Input System
- **Percentage Input**: Instead of entering large numbers, simply input percentage (e.g., 5% = 50,000,000 tokens)
- **Real-time Conversion**: See the actual token amount as you type
- **Total Supply Display**: Always shows the 1 billion $PROVE token supply

### Advanced Calculations
- **Total Tokens per Group**: `(group_percentage / 100) * total_airdrop_tokens`
- **Average per User**: `total_tokens_for_group / user_count` (where applicable)
- **Remaining Tokens**: Shows unallocated tokens from the airdrop

### Enhanced Validation
- **Real-time Total**: Shows total allocation percentage as you type
- **Over-allocation Warning**: Subtle warning when total exceeds 100%
- **Smart Button States**: Calculate button disabled until valid input

### Beautiful Animations
- **Staggered Results**: Results appear with smooth delays
- **Hover Effects**: Interactive elements respond to user interaction
- **Fade-ins**: Smooth entrance animations for all sections

## 🎨 Color Theme

The application uses a stunning purple/pink color palette:
- **Primary**: Purple tones (`purple-500`, `purple-600`, etc.)
- **Secondary**: Pink and rose accents
- **Background**: Soft gradient from purple to pink
- **Text**: Dark gray for readability with purple highlights
- **Glass Effects**: Semi-transparent backgrounds with blur effects

## 📱 Responsive Design

- **Mobile-First**: Optimized for touch devices
- **Adaptive Layout**: Grid automatically adjusts to screen size
- **Touch-Friendly**: Large, accessible input controls
- **Smooth Scrolling**: Custom scrollbar with gradient design

## 📁 Project Structure

```
src/
├── SuccinctAirdropCalculator.tsx  # Main calculator component
├── App.tsx                        # App wrapper
├── main.tsx                       # React entry point
└── index.css                      # Global styles with custom theme
```

## 🎯 Key Improvements

- **Percentage-Based Input**: No more typing large numbers - just enter percentages!
- **Beautiful Theme**: Stunning purple/pink gradients with glass morphism
- **Enhanced UX**: Smooth animations and hover effects
- **Better Typography**: Improved font hierarchy and readability
- **Custom Scrollbar**: Beautiful gradient scrollbar design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and estimation purposes only.

---

**Note**: This calculator is unofficial and for estimation purposes only. Total $PROVE supply: 1,000,000,000 tokens. 