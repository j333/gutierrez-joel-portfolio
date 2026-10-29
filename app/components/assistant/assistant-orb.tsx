'use client'

import { useEffect, useRef, useState } from 'react'

type AssistantOrbProps = {
  className?: string
  mode?: 'icon' | 'backdrop'
  loading?: boolean
}

const vertexSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentSource = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uDark;
uniform float uLoading;

float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(i);
  float n100 = hash(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float weight = 0.5;
  for (int octave = 0; octave < 3; octave += 1) {
    value += weight * noise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.4);
    weight *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  vec2 pull = (uPointer - 0.5) * vec2(0.42, -0.42);
  vec2 p = uv - pull * 0.55;
  float radius = length(p);
  float breathe = 1.0 + uLoading * 0.07 * sin(uTime * 4.2);
  float sphere = 1.0 - smoothstep(0.16, 0.45 * breathe, radius);
  float depth = sqrt(max(0.5 * 0.5 - dot(p, p), 0.0));
  float smoke = 0.0;
  float speed = mix(1.0, 2.8, uLoading);

  for (int layer = 0; layer < 4; layer += 1) {
    float step = (float(layer) + 0.5) / 4.0;
    vec3 samplePosition = vec3((p + pull) * 2.15, mix(-depth, depth, step) * 2.8);
    samplePosition += vec3(uTime * 0.16 * speed, -uTime * 0.1 * speed, uTime * 0.18 * speed);
    smoke += smoothstep(0.25, 0.68, fbm(samplePosition));
  }

  smoke = smoothstep(0.18, 0.92, smoke / 4.0);
  vec3 cyan = mix(vec3(0.05, 0.48, 0.82), vec3(0.48, 0.84, 1.0), uDark);
  vec3 blue = mix(vec3(0.08, 0.2, 0.78), vec3(0.28, 0.46, 1.0), uDark);
  vec3 violet = mix(vec3(0.34, 0.04, 0.74), vec3(0.64, 0.24, 1.0), uDark);
  float violetMix = smoothstep(-0.28, 0.48, -p.y + smoke * 0.22);
  vec3 color = mix(mix(cyan, blue, smoothstep(-0.45, 0.2, -p.y)), violet, violetMix);
  float alpha = sphere * mix(0.78, 1.0, smoke);
  alpha = clamp(alpha, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}
`

const trackElement = (canvas: HTMLCanvasElement) => {
  let node = canvas.parentElement

  while (node) {
    if (window.getComputedStyle(node).pointerEvents !== 'none') {
      return node
    }

    node = node.parentElement
  }

  return canvas
}

const isDarkTheme = () => document.documentElement.classList.contains('dark')

export const AssistantOrb = ({ className, mode = 'icon', loading = false }: AssistantOrbProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingRef = useRef(loading)
  const [fallback, setFallback] = useState(false)

  loadingRef.current = loading

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: mode === 'backdrop' ? 'low-power' : 'default',
    })

    if (!gl) {
      setFallback(true)
      return
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)

      if (!shader) {
        return null
      }

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertex = compile(gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    const program = vertex && fragment ? gl.createProgram() : null

    if (!program || !vertex || !fragment) {
      setFallback(true)
      return
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      setFallback(true)
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.useProgram(program)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'uResolution')
    const pointer = gl.getUniformLocation(program, 'uPointer')
    const time = gl.getUniformLocation(program, 'uTime')
    const dark = gl.getUniformLocation(program, 'uDark')
    const loadingUniform = gl.getUniformLocation(program, 'uLoading')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aim = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let reduce = motion.matches
    let visible = true
    let frame = 0
    let lastDraw = 0
    let running = true

    const draw = (now: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (width < 2 || height < 2) {
        return
      }

      const ratio = Math.min(window.devicePixelRatio || 1, mode === 'backdrop' ? 1.25 : 2)
      const bufferWidth = Math.round(width * ratio)
      const bufferHeight = Math.round(height * ratio)

      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth
        canvas.height = bufferHeight
      }

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform2f(pointer, aim.x, aim.y)
      gl.uniform1f(time, reduce ? 0 : now * 0.001)
      gl.uniform1f(dark, isDarkTheme() ? 1 : 0)
      gl.uniform1f(loadingUniform, loadingRef.current ? 1 : 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const handleMove = (event: PointerEvent) => {
      if (reduce) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      aim.tx = (event.clientX - rect.left) / rect.width
      aim.ty = (event.clientY - rect.top) / rect.height
    }

    const handleLeave = () => {
      aim.tx = 0.5
      aim.ty = 0.5
    }

    const handleMotion = () => {
      reduce = motion.matches

      if (reduce) {
        aim.x = 0.5
        aim.y = 0.5
        aim.tx = 0.5
        aim.ty = 0.5
        draw(0)
      }
    }

    const track = trackElement(canvas)
    const resizeObserver = new ResizeObserver(() => {
      if (reduce) {
        draw(0)
      }
    })
    const themeObserver = new MutationObserver(() => {
      if (reduce) {
        draw(0)
      }
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false

      if (reduce && visible) {
        draw(0)
      }
    })

    const loop = (now: number) => {
      if (!running) {
        return
      }

      frame = window.requestAnimationFrame(loop)

      if (reduce || !visible || document.hidden) {
        return
      }

      const interval = mode === 'backdrop' ? 32 : 16

      if (now - lastDraw < interval) {
        return
      }

      lastDraw = now
      aim.x += (aim.tx - aim.x) * 0.12
      aim.y += (aim.ty - aim.y) * 0.12
      draw(now)
    }

    track.addEventListener('pointermove', handleMove)
    track.addEventListener('pointerleave', handleLeave)
    motion.addEventListener('change', handleMotion)
    resizeObserver.observe(canvas)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    intersectionObserver.observe(canvas)
    frame = window.requestAnimationFrame(loop)

    if (reduce) {
      draw(0)
    }

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      track.removeEventListener('pointermove', handleMove)
      track.removeEventListener('pointerleave', handleLeave)
      motion.removeEventListener('change', handleMotion)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      intersectionObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [mode])

  if (fallback) {
    return (
      <div aria-hidden className={`relative overflow-hidden bg-transparent ${className ?? ''}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(92,36,196,0.95)_0%,rgba(36,78,196,0.55)_34%,rgba(86,176,214,0.28)_58%,transparent_74%)] dark:bg-[radial-gradient(circle_at_50%_62%,rgba(176,104,255,0.95)_0%,rgba(78,112,255,0.62)_36%,rgba(126,214,255,0.24)_60%,transparent_76%)]" />
      </div>
    )
  }

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
