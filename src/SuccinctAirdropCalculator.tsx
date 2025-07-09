import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import logo from './assets/image.png'

interface Group {
  id: string
  name: string
  userCount?: number
  percentage: number
}

interface CalculationResult {
  groupName: string
  percentage: number
  totalTokens: number
  userCount?: number
  averagePerUser?: number
}

const TOTAL_SUPPLY = 1000000000 // 1 billion $PROVE tokens

const SuccinctAirdropCalculator: React.FC = () => {
  const [totalTokensPercentage, setTotalTokensPercentage] = useState<string>('')
  const [groups, setGroups] = useState<Group[]>([
    { id: 'stage1', name: 'Stage 1', userCount: 25000, percentage: 0 },
    { id: 'stage2', name: 'Stage 2', userCount: 3700, percentage: 0 },
    { id: 'stage25', name: 'Stage 2.5', userCount: 25000, percentage: 0 },
    { id: 'provers', name: 'Provers', userCount: 75, percentage: 0 },
    { id: 'discord', name: 'Discord Roles', userCount: 500, percentage: 0 },
    { id: 'github', name: 'GitHub/Developers', percentage: 0 }
  ])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<CalculationResult[]>([])
  const resultsRef = useRef<HTMLDivElement>(null)
  const hiddenResultsRef = useRef<HTMLDivElement>(null)

  const handleGroupPercentageChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, percentage: numValue } : group
      )
    )
  }

  const calculateResults = () => {
    const totalTokensPercentageNum = parseFloat(totalTokensPercentage) || 0
    const totalTokensNum = (totalTokensPercentageNum / 100) * TOTAL_SUPPLY
    
    const calculatedResults: CalculationResult[] = groups.map(group => {
      const totalTokensForGroup = (group.percentage / 100) * totalTokensNum
      const result: CalculationResult = {
        groupName: group.name,
        percentage: group.percentage,
        totalTokens: totalTokensForGroup,
        userCount: group.userCount
      }
      
      if (group.userCount && group.userCount > 0) {
        result.averagePerUser = totalTokensForGroup / group.userCount
      }
      
      return result
    })
    
    setResults(calculatedResults)
    setShowResults(true)
  }

  const shareToTwitter = async () => {
    if (!results.length || !hiddenResultsRef.current) return

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat().format(Math.round(num))
    }

    // Create a nicely formatted allocation text
    const allocationText = results
      .filter(result => result.percentage > 0)
      .map(result => {
        const tokens = formatNumber(result.totalTokens)
        const percentage = result.percentage.toFixed(1)
        return `• ${result.groupName}: ${percentage}% (${tokens} $PROVE)`
      })
      .join('\n')

    const airdropPercent = parseFloat(totalTokensPercentage || '0').toFixed(1)

    const tweetText = `${airdropPercent}% of the total supply is allocated for airdrop.\n\nAccording to me, the Succinct airdrop will be distributed like this:\n\n${allocationText}\n\n#Succinct #Airdrop #PROVE`

    try {
      // Always screenshot the hidden full results area
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        const canvas = await (window as any).html2canvas(hiddenResultsRef.current, {
          backgroundColor: '#faf5ff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: 600
        })
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png')
        
        // Create a temporary page with the image, info, and meta tags
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Succinct Airdrop Results</title>
              <meta name="twitter:card" content="summary_large_image">
              <meta name="twitter:title" content="Succinct Airdrop Distribution">
              <meta name="twitter:description" content="Check out my Succinct airdrop allocation predictions!">
              <meta name="twitter:image" content="${dataUrl}">
              <meta name="twitter:site" content="@kendinecrypto_">
              <meta property="og:title" content="Succinct Airdrop Distribution">
              <meta property="og:description" content="Check out my Succinct airdrop allocation predictions!">
              <meta property="og:image" content="${dataUrl}">
              <meta property="og:type" content="website">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%);
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: white; 
                  border-radius: 20px; 
                  padding: 30px; 
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                h1 { 
                  color: #7c3aed; 
                  text-align: center; 
                  margin-bottom: 30px;
                }
                .tweet-btn {
                  display: block;
                  width: 100%;
                  background: #1da1f2;
                  color: white;
                  text-decoration: none;
                  padding: 15px;
                  border-radius: 10px;
                  text-align: center;
                  font-weight: bold;
                  margin-top: 20px;
                }
                .tweet-btn:hover {
                  background: #1991db;
                }
                .info {
                  margin: 20px 0 10px 0;
                  color: #7c3aed;
                  font-size: 1.1rem;
                  text-align: center;
                  font-weight: 500;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📊 Succinct Airdrop Results</h1>
                <img src="${dataUrl}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" alt="Airdrop Results">
                <div class="info">You can copy this image and add it to your tweet!</div>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}" class="tweet-btn" target="_blank">
                  🐦 Share on Twitter
                </a>
              </div>
            </body>
            </html>
          `)
          newWindow.document.close()
        }
      } else {
        // Fallback to text-only tweet
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
        window.open(twitterUrl, '_blank')
      }
    } catch (error) {
      console.error('Error sharing to Twitter:', error)
      // Fallback to text-only tweet
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
      window.open(twitterUrl, '_blank')
    }
  }

  const totalPercentage = groups.reduce((sum, group) => sum + group.percentage, 0)
  const isOver100 = totalPercentage > 100
  const totalTokensNum = (parseFloat(totalTokensPercentage) || 0) / 100 * TOTAL_SUPPLY

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num))
  }

  const formatPercentage = (num: number) => {
    return num.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <img src={logo} alt="Succinct Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
            Succinct Airdrop Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Calculate $PROVE token distribution across multiple user groups with customizable percentage allocations
          </p>
          <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <p className="text-lg font-semibold text-gray-700">
              Total Supply: <span className="text-purple-600 font-bold">{formatNumber(TOTAL_SUPPLY)} $PROVE</span>
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Total Tokens Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Airdrop Allocation
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Percentage of Total Supply
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={totalTokensPercentage}
                      onChange={(e) => setTotalTokensPercentage(e.target.value)}
                      placeholder="Enter percentage (e.g., 5 for 5%)"
                      className="w-full px-6 py-4 text-xl border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 font-bold text-xl">%</span>
                  </div>
                </div>
                
                {totalTokensPercentage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Tokens:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatNumber(totalTokensNum)} $PROVE
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Group Allocations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                Group Allocations
              </h2>
              <div className="space-y-6">
                {groups.map((group) => (
                  <motion.div 
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-md"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
                      {group.userCount && (
                        <p className="text-purple-600 font-medium">{group.userCount.toLocaleString()} users</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={group.percentage || ''}
                        onChange={(e) => handleGroupPercentageChange(group.id, e.target.value)}
                        placeholder="0"
                        className="w-24 px-4 py-3 text-center border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white/50 font-semibold"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="text-purple-600 font-bold text-lg">%</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total Percentage Display */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">Total Allocation:</span>
                  <span className={`text-2xl font-bold ${isOver100 ? 'text-red-600' : 'text-purple-600'}`}>
                    {formatPercentage(totalPercentage)}%
                  </span>
                </div>
                {isOver100 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-red-700 font-medium">
                      ⚠️ Total exceeds 100%. This may result in over-allocation.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Calculate Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={calculateResults}
                disabled={!totalTokensPercentage || totalTokensPercentage === '0'}
                className="w-full mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
              >
                Calculate Distribution
              </motion.button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {showResults && (
              <div ref={resultsRef} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Distribution Results
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareToTwitter}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span>Share</span>
                  </motion.button>
                </div>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.groupName}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl border border-purple-200 shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-800 text-xl">{result.groupName}</h3>
                        <span className="text-purple-600 font-bold text-lg">{formatPercentage(result.percentage)}%</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-purple-600 font-semibold">Total Tokens:</span>
                          <p className="font-bold text-gray-800 text-lg">{formatNumber(result.totalTokens)} $PROVE</p>
                        </div>
                        
                        {result.userCount && (
                          <div className="space-y-2">
                            <span className="text-purple-600 font-semibold">Users:</span>
                            <p className="font-bold text-gray-800 text-lg">{result.userCount.toLocaleString()}</p>
                          </div>
                        )}
                        
                        {result.averagePerUser && (
                          <div className="col-span-2 space-y-2">
                            <span className="text-purple-600 font-semibold">Average per User:</span>
                            <p className="font-bold text-gray-800 text-lg">{formatNumber(result.averagePerUser)} $PROVE</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-300"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total Allocated:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatNumber(results.reduce((sum, r) => sum + r.totalTokens, 0))} $PROVE
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Remaining:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatNumber(totalTokensNum - results.reduce((sum, r) => sum + r.totalTokens, 0))} $PROVE
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            {/* Hidden full allocation results for screenshot */}
            {showResults && (
              <div style={{ position: 'absolute', left: '-99999px', top: 0 }}>
                <div ref={hiddenResultsRef}>
                  <div style={{ width: 600, background: '#fff', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 32, margin: 0 }}>
                    <h2 style={{ color: '#7c3aed', fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Succinct Airdrop Allocation</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {results.map((result) => (
                        <div key={result.groupName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf5ff', borderRadius: 16, padding: 16, border: '1px solid #e9d5ff' }}>
                          <div style={{ fontWeight: 600, color: '#7c3aed', fontSize: 18 }}>{result.groupName}</div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#a21caf', fontWeight: 700, fontSize: 18 }}>{formatNumber(result.totalTokens)} $PROVE</div>
                            <div style={{ color: '#7c3aed', fontWeight: 500, fontSize: 15 }}>{result.percentage.toFixed(1)}%</div>
                            {result.userCount && (
                              <div style={{ color: '#6366f1', fontSize: 13 }}>{result.userCount.toLocaleString()} users</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-gray-600 text-sm"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="mb-2">This calculator is unofficial and for estimation purposes only.</p>
            <a 
              href="https://x.com/kendinecrypto_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>Made by KendineCrypto_</span>
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default SuccinctAirdropCalculator 