"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [todayVisits, setTodayVisits] = useState(30)
  const [currentDate, setCurrentDate] = useState("")

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
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = `rgba(255, 122, 0, ${this.opacity})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    const particleCount = Math.min(window.innerWidth / 15, 80)

    for (let i = 0; i < particleCount; i++) {
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

  // Função para calcular visitas baseado no horário de Brasília
  const calculateVisitsBasedOnTime = () => {
    const now = new Date()

    // Converter para horário de Brasília (UTC-3)
    const brasiliaTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)
    const hours = brasiliaTime.getHours()
    const minutes = brasiliaTime.getMinutes()

    // Calcular progresso do dia (0 a 1)
    const dayProgress = (hours * 60 + minutes) / (24 * 60)

    // Calcular visitas base (30 a 754)
    const baseVisits = Math.floor(30 + dayProgress * (754 - 30))

    // Adicionar variação aleatória pequena (-5 a +10)
    const randomVariation = Math.floor(Math.random() * 16) - 5

    return Math.max(30, Math.min(754, baseVisits + randomVariation))
  }

  // Função para formatar data em português
  const formatBrazilianDate = () => {
    const now = new Date()
    const brasiliaTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)

    const day = brasiliaTime.getDate().toString().padStart(2, "0")
    const month = (brasiliaTime.getMonth() + 1).toString().padStart(2, "0")
    const year = brasiliaTime.getFullYear()

    return `${day}/${month}/${year}`
  }

  // Atualizar contador de visitas
  useEffect(() => {
    const updateVisits = () => {
      setTodayVisits(calculateVisitsBasedOnTime())
      setCurrentDate(formatBrazilianDate())
    }

    // Atualizar imediatamente
    updateVisits()

    // Atualizar a cada 1-3 minutos
    const interval = setInterval(updateVisits, Math.random() * 120000 + 60000)

    return () => clearInterval(interval)
  }, [])

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

      {/* Header com Logo Centralizada */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 shadow-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smart-ilha-logo-oficial-kowxuyFbJTRjqyjAMTgZ7MTJu5uK1R.png"
              alt="Smart Ilha Logo"
              width={200}
              height={80}
              className="h-16 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Headline */}
          <div className="mb-16">
            <Badge
              variant="secondary"
              className="mb-6 bg-orange-500/20 text-orange-300 border-orange-500/20 px-6 py-3 text-sm font-medium backdrop-blur-sm"
            >
              🚀 Especialistas em Smartwatches
            </Badge>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Descubra os melhores smartwatches com atendimento personalizado e garantia de qualidade
            </p>
          </div>

          {/* Imagem Principal do Casal */}
          <div className="mb-16 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-0 bg-orange-500/10 rounded-3xl blur-3xl animate-pulse"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome-dHP7fw0CkYHphHy0pxVSqZIwKghEW4.png"
                alt="Casal usando smartwatches Smart Ilha"
                width={600}
                height={600}
                className="w-full h-auto object-contain relative z-10 rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Seção de Dica Importante */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 backdrop-blur-md border border-blue-500/25 rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/8 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  {/* Header da seção */}
                  <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 mb-3 md:mb-4 border border-blue-500/30">
                      <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mr-2 md:mr-3 animate-pulse" />
                      <Badge
                        variant="secondary"
                        className="bg-transparent text-blue-300 border-none text-sm md:text-lg font-bold"
                      >
                        DICA EXTREMAMENTE IMPORTANTE
                      </Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 tracking-tight">
                      Antes de Prosseguir...
                    </h2>
                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                      Para um atendimento mais eficiente, confira os valores dos smartwatch no Instagram primeiro!
                    </p>
                  </div>

                  {/* Conteúdo principal */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    {/* Lado direito - Imagem do Instagram - MOBILE FIRST */}
                    <div className="relative md:order-2">
                      <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-2xl"></div>
                      <div className="relative bg-gray-800/60 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-gray-600/50 shadow-xl">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Guia.jpg-ccjdvH2XyEEU98XKBhH1w7maVVcbcX.jpeg"
                          alt="Guia do perfil Instagram Smart Ilha mostrando onde encontrar os preços"
                          width={400}
                          height={600}
                          className="w-full h-auto rounded-xl shadow-lg"
                        />
                      </div>
                    </div>

                    {/* Lado esquerdo - Instruções - MOBILE SECOND */}
                    <div className="space-y-4 md:space-y-6 md:order-1">
                      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-600/50">
                        <h3 className="text-lg md:text-xl font-bold text-orange-400 mb-3 md:mb-4 flex items-center">
                          <Eye className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                          Como encontrar os preços:
                        </h3>
                        <div className="space-y-2 md:space-y-3 text-gray-200 text-sm md:text-base">
                          <div className="flex items-start">
                            <span className="bg-orange-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                              1
                            </span>
                            <p className="leading-relaxed">
                              Acesse nosso perfil no Instagram <strong>@smartilha</strong>
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-orange-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                              2
                            </span>
                            <p className="leading-relaxed">
                              Procure pelos <strong>Destaques</strong> na parte inferior do perfil
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-orange-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                              3
                            </span>
                            <p className="leading-relaxed">
                              Clique no destaque <strong className="text-blue-400">"PROMOÇÃO"</strong> (primeiro da
                              lista)
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-orange-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                              4
                            </span>
                            <p className="leading-relaxed">Confira todos os valores e modelos disponíveis</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer da seção */}
                  <div className="mt-6 md:mt-8 text-center">
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-green-500/30">
                      <p className="text-green-300 font-medium text-sm md:text-base">
                        ✅ Depois de conferir os preços, volte aqui e prossiga com o atendimento personalizado!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-800/60 backdrop-blur-md border border-gray-600/50 rounded-3xl p-10 max-w-3xl mx-auto shadow-xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Pronto para encontrar seu
              <br className="hidden md:block" />
              <span className="text-orange-400"> Smartwatch Ideal?</span>
            </h2>
            <p className="text-gray-300 mb-8 text-lg font-light">
              Responda algumas perguntas rápidas e receba atendimento personalizado com nossa equipe especializada
            </p>
            <div className="space-y-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/30 w-full md:w-auto"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Iniciar Atendimento Personalizado
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contador de Visitas */}
        <div className="fixed bottom-6 left-6 z-20">
          <div className="bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-orange-400 font-bold text-lg">
                  {todayVisits.toLocaleString("pt-BR")} visitas hoje
                </div>
                <div className="text-gray-400 text-sm">{currentDate}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
