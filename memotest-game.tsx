"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Trophy } from "lucide-react"

interface GameCard {
  id: number
  imageId: number
  isFlipped: boolean
  isMatched: boolean
}

const getCardColor = (imageId: number): string => {
  const colors = [
    "bg-gradient-to-br from-red-400 to-red-600", // 1 - Heart
    "bg-gradient-to-br from-blue-400 to-blue-600", // 2 - Star
    "bg-gradient-to-br from-green-400 to-green-600", // 3 - Tree
    "bg-gradient-to-br from-yellow-400 to-yellow-600", // 4 - Sun
    "bg-gradient-to-br from-purple-400 to-purple-600", // 5 - Gem
    "bg-gradient-to-br from-pink-400 to-pink-600", // 6 - Flower
    "bg-gradient-to-br from-orange-400 to-orange-600", // 7 - Fire
    "bg-gradient-to-br from-teal-400 to-teal-600", // 8 - Water
  ]
  return colors[imageId - 1] || colors[0]
}

const getCardEmoji = (imageId: number): string => {
  const emojis = ["❤️", "⭐", "🌳", "☀️", "💎", "🌸", "🔥", "💧"]
  return emojis[imageId - 1] || "❤️"
}

const getCardLabel = (imageId: number): string => {
  const labels = ["HEART", "STAR", "TREE", "SUN", "GEM", "FLOWER", "FIRE", "WATER"]
  return labels[imageId - 1] || "HEART"
}

export default function Component() {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Initialize game
  const initializeGame = () => {
    const imageIds = Array.from({ length: 8 }, (_, i) => i + 1)
    const cardPairs = [...imageIds, ...imageIds]

    const shuffledCards = cardPairs
      .map((imageId, index) => ({
        id: index,
        imageId,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameCompleted(false)
    setIsChecking(false)
  }

  // Initialize game on component mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstCardId)
      const secondCard = cards.find((c) => c.id === secondCardId)

      if (firstCard && secondCard && firstCard.imageId === secondCard.imageId) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstCardId || c.id === secondCardId ? { ...c, isMatched: true } : c)),
          )
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstCardId || c.id === secondCardId ? { ...c, isFlipped: false } : c)),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1500)
      }
    }
  }

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === 8) {
      setGameCompleted(true)
    }
  }, [matchedPairs])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rosental</h1>
          <p className="text-gray-600">¡Encuentra todos los pares iguales!</p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-gray-600">Movimientos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{matchedPairs}/8</div>
            <div className="text-sm text-gray-600">Pares</div>
          </div>
          <Button onClick={initializeGame} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset!
          </Button>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`
                aspect-square cursor-pointer transition-all duration-300 hover:scale-105
                ${card.isMatched ? "ring-2 ring-green-400 bg-green-50" : ""}
                ${card.isFlipped || card.isMatched ? "shadow-lg" : "shadow-md hover:shadow-lg"}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                {card.isFlipped || card.isMatched ? (
                  <div
                    className={`w-full h-full rounded-md flex items-center justify-center text-white font-bold text-lg ${getCardColor(card.imageId)}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-1">{getCardEmoji(card.imageId)}</div>
                      <div className="text-xs opacity-80">{getCardLabel(card.imageId)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 rounded-md flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full relative z-10"></div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Game Completion Modal */}
        {gameCompleted && (
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations! 🎉</h2>
            <p className="text-gray-600 mb-4">You completed the game in {moves} moves!</p>
            <Button onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
