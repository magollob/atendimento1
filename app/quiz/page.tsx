"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface QuizAnswer {
  question1?: string
  question2?: string
  question3?: string
  question4?: string
  question5?: string
  question6?: string
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswer>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Professional particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(255, 122, 0, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  const questions = [
    {
      id: 1,
      question: "Você conheceu a Smart Ilha por indicação ou anúncio?",
      options: [
        { value: "indicacao", label: "Por indicação" },
        { value: "anuncio", label: "Por anúncio" },
      ],
    },
    {
      id: 2,
      question: "Está em busca de um presente ou é uma compra pessoal?",
      options: [
        { value: "presente", label: "É um presente" },
        { value: "pessoal", label: "Compra pessoal" },
      ],
    },
    {
      id: 3,
      question: "Esse é seu primeiro contato com a Smart Ilha?",
      options: [
        { value: "sim", label: "Sim, é meu primeiro contato" },
        { value: "nao", label: "Não, já conhecia a loja" },
      ],
    },
    {
      id: 4,
      question: "Para qual região seria a entrega do pedido?",
      options: [
        { value: "ilha", label: "Ilha do Governador" },
        { value: "outra", label: "Outra região" },
      ],
    },
    {
      id: 5,
      question: "Qual modelo de smartwatch você busca?",
      options: [
        { value: "feminino", label: "Modelo feminino" },
        { value: "masculino", label: "Modelo masculino" },
      ],
    },
    {
      id: 6,
      question: "Você está entrando em contato para saber sobre:",
      options: [
        { value: "preco", label: "Preço de Smartwatch" },
        { value: "duvida", label: "Dúvida Técnica" },
        { value: "pedido", label: "Fazer meu Pedido" },
        { value: "outro", label: "Outro Produto" },
      ],
    },
  ]

  const handleAnswer = (value: string) => {
    if (isTransitioning) return

    const questionKey = `question${currentQuestion}` as keyof QuizAnswer
    const updatedAnswers = { ...answers, [questionKey]: value }

    // Atualizar o estado das respostas
    setAnswers(updatedAnswers)

    // Salvar no localStorage imediatamente
    localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers))

    // Log para debug
    console.log(`Resposta ${currentQuestion}:`, value)
    console.log("Todas as respostas:", updatedAnswers)

    // Iniciar transição com animação de fade
    setIsTransitioning(true)
    setIsVisible(false)

    // Avançar para próxima pergunta ou finalizar
    setTimeout(() => {
      if (currentQuestion < 6) {
        setCurrentQuestion((prev) => prev + 1)
        setTimeout(() => {
          setIsVisible(true)
          setIsTransitioning(false)
        }, 100)
      } else {
        finishQuiz(updatedAnswers)
      }
    }, 400)
  }

  const prevQuestion = () => {
    if (currentQuestion > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setIsVisible(false)

      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1)
        setTimeout(() => {
          setIsVisible(true)
          setIsTransitioning(false)
        }, 100)
      }, 400)
    }
  }

  const finishQuiz = (finalAnswers: QuizAnswer) => {
    // Garantir que as respostas estão salvas
    localStorage.setItem("quizAnswers", JSON.stringify(finalAnswers))
    console.log("Quiz finalizado com respostas:", finalAnswers)

    // Redirecionar para página de agradecimento
    router.push("/obrigado")
  }

  const currentQuestionData = questions[currentQuestion - 1]
  const currentAnswer = answers[`question${currentQuestion}` as keyof QuizAnswer]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Professional Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-3 border border-gray-600/50 shadow-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smart-ilha-logo-oficial-kowxuyFbJTRjqyjAMTgZ7MTJu5uK1R.png"
              alt="Smart Ilha Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/20 backdrop-blur-sm"
          >
            Pergunta {currentQuestion} de 6
          </Badge>
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-6 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/20"
              style={{ width: `${(currentQuestion / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Card className="bg-gray-800/60 backdrop-blur-md border-gray-600/50 max-w-2xl mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-white text-center leading-relaxed font-light tracking-tight">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={option.value}
                  variant={currentAnswer === option.value ? "default" : "outline"}
                  className={`w-full p-6 text-left justify-start text-lg transition-all duration-300 ${
                    currentAnswer === option.value
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent shadow-lg shadow-orange-500/20"
                      : "bg-gray-700/50 text-white border-gray-600/50 hover:bg-gray-700/70 hover:border-orange-500/30 backdrop-blur-sm"
                  }`}
                  onClick={() => handleAnswer(option.value)}
                  disabled={isTransitioning}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 transition-all duration-300 ${
                      currentAnswer === option.value ? "bg-white border-white" : "border-gray-400"
                    }`}
                  >
                    {currentAnswer === option.value && <div className="w-3 h-3 bg-orange-500 rounded-full m-0.5"></div>}
                  </div>
                  <span className="text-white">{option.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-start mt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 1 || isTransitioning}
            className="bg-gray-700/50 text-white border-gray-600/50 hover:bg-gray-700/70 disabled:opacity-50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        </div>
      </main>
    </div>
  )
}
