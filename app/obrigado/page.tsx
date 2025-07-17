"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, CheckCircle, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface QuizAnswers {
  question1?: string
  question2?: string
  question3?: string
  question4?: string
  question5?: string
  question6?: string
}

export default function ThankYouPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
  const [todayViews, setTodayViews] = useState(35)
  const [currentDate, setCurrentDate] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Função para calcular visualizações baseado no horário de Brasília
  const calculateViewsBasedOnTime = () => {
    const now = new Date()

    // Converter para horário de Brasília (UTC-3)
    const brasiliaTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)
    const hours = brasiliaTime.getHours()
    const minutes = brasiliaTime.getMinutes()

    // Calcular progresso do dia (0 a 1)
    const dayProgress = (hours * 60 + minutes) / (24 * 60)

    // Calcular visualizações base (35 a 765)
    const baseViews = Math.floor(35 + dayProgress * (765 - 35))

    // Adicionar variação aleatória pequena (-8 a +20)
    const randomVariation = Math.floor(Math.random() * 29) - 8

    return Math.max(35, Math.min(765, baseViews + randomVariation))
  }

  // Função para formatar data em português
  const formatBrazilianDate = () => {
    const now = new Date()
    const brasiliaTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Sao_Paulo",
    }

    return brasiliaTime.toLocaleDateString("pt-BR", options)
  }

  // Carregar respostas do quiz quando a página carregar
  useEffect(() => {
    const savedAnswers = localStorage.getItem("quizAnswers")
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers)
        setQuizAnswers(parsedAnswers)
        console.log("Respostas carregadas:", parsedAnswers)
      } catch (error) {
        console.error("Erro ao carregar respostas:", error)
      }
    } else {
      console.log("Nenhuma resposta encontrada no localStorage")
    }
  }, [])

  // Atualizar visualizações e data
  useEffect(() => {
    const updateStats = () => {
      setTodayViews(calculateViewsBasedOnTime())
      setCurrentDate(formatBrazilianDate())
    }

    // Atualizar imediatamente
    updateStats()

    // Atualizar a cada 2-4 minutos
    const interval = setInterval(updateStats, Math.random() * 120000 + 120000)

    return () => clearInterval(interval)
  }, [])

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
    for (let i = 0; i < 80; i++) {
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

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const generateWhatsAppMessage = () => {
    // Mensagem base
    let message = "Olá, vim através do Instagram e gostaria de mais informações sobre smartwatches!"

    if (quizAnswers) {
      // Informações sobre presente/pessoal (pergunta 2)
      let tipoCompra = ""
      if (quizAnswers.question2 === "presente") {
        tipoCompra = "É um presente"
      } else if (quizAnswers.question2 === "pessoal") {
        tipoCompra = "Compra pessoal"
      }

      // Informações sobre região (pergunta 4)
      let regiao = ""
      if (quizAnswers.question4 === "ilha") {
        regiao = "Ilha do Governador"
      } else if (quizAnswers.question4 === "outra") {
        regiao = "Outra região"
      }

      // Informações sobre modelo (pergunta 5)
      let modelo = ""
      if (quizAnswers.question5 === "feminino") {
        modelo = "Modelo feminino"
      } else if (quizAnswers.question5 === "masculino") {
        modelo = "Modelo masculino"
      }

      // Informações sobre motivo do contato (pergunta 6)
      let motivo = ""
      if (quizAnswers.question6 === "preco") {
        motivo = "Preço de Smartwatch"
      } else if (quizAnswers.question6 === "duvida") {
        motivo = "Dúvida Técnica"
      } else if (quizAnswers.question6 === "pedido") {
        motivo = "Fazer meu Pedido"
      } else if (quizAnswers.question6 === "outro") {
        motivo = "Outro Produto"
      }

      // Construir mensagem personalizada
      if (tipoCompra && regiao && modelo && motivo) {
        message = `Olá, vim através do Instagram e gostaria de mais informações sobre smartwatches!

📋 *Informações do atendimento:*
🎁 Tipo: ${tipoCompra}
📍 Região: ${regiao}
⌚ Modelo: ${modelo}
❓ Motivo: ${motivo}

Aguardo retorno! 😊`
      }

      console.log("Informações coletadas:", { tipoCompra, regiao, modelo, motivo })
    }

    return message
  }

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage()
    console.log("Mensagem final para WhatsApp:", message)

    const whatsappUrl = `https://wa.me/5521980202797?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Professional Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Header com Logo */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 shadow-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smart-ilha-logo-oficial-kowxuyFbJTRjqyjAMTgZ7MTJu5uK1R.png"
              alt="Smart Ilha Logo"
              width={120}
              height={120}
              className="h-16 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Gatilho de Visualizações */}
      <div className="fixed bottom-6 left-6 z-20">
        <div className="bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-orange-400" />
            <span className="text-white text-sm font-semibold">
              {todayViews.toLocaleString("pt-BR")} visualizaram hoje
            </span>
          </div>
          <div className="text-xs text-gray-400 text-center">{currentDate}</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 min-h-screen flex flex-col justify-center">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Success Icon */}
          <div className="mb-12">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20 animate-float">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* Thank You Message */}
          <Card className="bg-gray-800/60 backdrop-blur-md border-gray-600/50 max-w-3xl mx-auto mb-16 overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
            <div className="p-12 relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Obrigado!</h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
                Nossa equipe especializada da
                <span className="text-orange-400 font-semibold"> Smart Ilha </span>
                está disponível agora para prosseguir com seu atendimento personalizado!
              </p>

              <p className="text-lg text-orange-300 mb-12 font-medium">
                👇 Clique no botão abaixo para continuar no WhatsApp!
              </p>

              {/* Informações do Cliente */}
              {quizAnswers && (
                <div className="bg-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 mb-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-orange-400 mb-4">📋 Suas informações:</h3>
                  <div className="space-y-3 text-left">
                    {quizAnswers.question2 && (
                      <div className="flex items-center">
                        <span className="text-gray-300 mr-2">🎁</span>
                        <span className="text-white">
                          {quizAnswers.question2 === "presente" ? "É um presente" : "Compra pessoal"}
                        </span>
                      </div>
                    )}
                    {quizAnswers.question4 && (
                      <div className="flex items-center">
                        <span className="text-gray-300 mr-2">📍</span>
                        <span className="text-white">
                          {quizAnswers.question4 === "ilha" ? "Ilha do Governador" : "Outra região"}
                        </span>
                      </div>
                    )}
                    {quizAnswers.question5 && (
                      <div className="flex items-center">
                        <span className="text-gray-300 mr-2">⌚</span>
                        <span className="text-white">
                          {quizAnswers.question5 === "feminino" ? "Modelo feminino" : "Modelo masculino"}
                        </span>
                      </div>
                    )}
                    {quizAnswers.question6 && (
                      <div className="flex items-center">
                        <span className="text-gray-300 mr-2">❓</span>
                        <span className="text-white">
                          {quizAnswers.question6 === "preco"
                            ? "Preço de Smartwatch"
                            : quizAnswers.question6 === "duvida"
                              ? "Dúvida Técnica"
                              : quizAnswers.question6 === "pedido"
                                ? "Fazer meu Pedido"
                                : "Outro Produto"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Debug Info - Remover em produção */}
              {process.env.NODE_ENV === "development" && quizAnswers && (
                <div className="bg-gray-900/50 p-4 rounded-lg mb-8 text-left text-sm text-gray-300">
                  <p>
                    <strong>Debug - Respostas do Quiz:</strong>
                  </p>
                  <p>Pergunta 1: {quizAnswers.question1}</p>
                  <p>Pergunta 2: {quizAnswers.question2}</p>
                  <p>Pergunta 3: {quizAnswers.question3}</p>
                  <p>Pergunta 4: {quizAnswers.question4}</p>
                  <p>Pergunta 5: {quizAnswers.question5}</p>
                  <p>Pergunta 6: {quizAnswers.question6}</p>
                  <div className="mt-2 p-2 bg-gray-800 rounded">
                    <strong>Mensagem WhatsApp:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">{generateWhatsAppMessage()}</pre>
                  </div>
                  <p className="mt-2">
                    <strong>Visualizações hoje:</strong> {todayViews} | <strong>Data:</strong> {currentDate}
                  </p>
                </div>
              )}

              {/* Smartwatch Image */}
              <div className="mb-12 flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smart-ilha-logo-oficial-kowxuyFbJTRjqyjAMTgZ7MTJu5uK1R.png"
                    alt="Smart Ilha Logo"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain relative z-10 animate-float"
                  />
                </div>
              </div>

              {/* Professional Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300 mb-8">
                <div className="flex items-center justify-center bg-gray-700/60 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
                  <CheckCircle className="w-5 h-5 text-orange-400 mr-3" />
                  Produtos Originais
                </div>
                <div className="flex items-center justify-center bg-gray-700/60 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
                  <CheckCircle className="w-5 h-5 text-orange-400 mr-3" />
                  90 Dias de Garantia
                </div>
                <div className="flex items-center justify-center bg-gray-700/60 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
                  <CheckCircle className="w-5 h-5 text-orange-400 mr-3" />
                  Suporte Vitalício
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="space-y-6">
            <Button
              onClick={openWhatsApp}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/30 w-full md:w-auto animate-pulse"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Continuar no WhatsApp
            </Button>

            <div className="text-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-gray-700/60 backdrop-blur-md text-white border-gray-600/50 hover:bg-gray-700/80 hover:border-orange-500/30 transition-all duration-300 px-8 py-3"
                >
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
