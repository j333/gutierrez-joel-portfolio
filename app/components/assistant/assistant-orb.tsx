'use client'

import { useEffect, useRef, useState } from 'react'

type AssistantOrbProps = {
  className?: string
  mode?: 'icon' | 'backdrop'
  loading?: boolean
  followPointer?: boolean
  eyes?: boolean
}

const GLITCH_BURST_MS = 280
const GLITCH_PAUSE_MS = 200
const GLITCH_TAIL_MS = 140
const GLITCH_BURST_INTENSITY = 1
const GLITCH_TAIL_INTENSITY = 16 / 18

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
uniform vec2 uLook;
uniform float uTime;
uniform float uDark;
uniform float uLoading;
uniform float uEyes;
uniform float uPixelRatio;
uniform float uGlitch;

float hash31(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

vec2 hash22(vec2 p) {
  return fract(
    sin(vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    )) * 43758.5453
  );
}

mat3 rotateX(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );
}

vec3 placeOnSphere(vec2 rest, float radius) {
  float depth = sqrt(max(radius * radius - dot(rest, rest), 0.0001));
  return vec3(rest, depth);
}

vec3 rotateOnSphere(vec3 eye, float yaw, float pitch) {
  float cy = cos(yaw);
  float sy = sin(yaw);
  float x1 = eye.x * cy + eye.z * sy;
  float z1 = -eye.x * sy + eye.z * cy;
  float cp = cos(pitch);
  float sp = sin(pitch);
  float y2 = eye.y * cp - z1 * sp;
  float z2 = eye.y * sp + z1 * cp;
  return vec3(x1, y2, z2);
}

float sphereEye(vec2 frag, vec3 eye, float radius, float eyeRadius, float openAmount) {
  float facing = clamp(eye.z / radius, 0.0, 1.0);
  vec2 delta = frag - eye.xy;
  delta.y /= max(openAmount, 0.05);
  float focal = 1.35;
  float scale = (focal - radius * 0.95) / max(focal - eye.z, 0.25);
  float major = eyeRadius * scale;
  float minor = max(major * max(facing, 0.18), 0.003);
  vec2 tilt = eye.xy;
  float tiltLen = length(tilt);
  float along = 0.0;
  float across = length(delta);

  if (tiltLen >= 0.001) {
    vec2 axis = tilt / tiltLen;
    along = dot(delta, axis);
    across = length(delta - axis * along);
  }

  float radial = sqrt((along * along) / (minor * minor) + (across * across) / (major * major));
  float disc = 1.0 - smoothstep(0.84, 1.0, radial);
  float horizon = smoothstep(0.05, 0.26, facing);
  float limb = 1.0 - smoothstep(radius * 0.88, radius * 1.16, length(frag));
  return disc * horizon * limb;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float glitchFrame = floor(uTime * 46.0);
  float glitchBand = floor((uv.y + 0.5) * 18.0);
  float glitchSlice = step(
    0.64,
    hash31(vec3(glitchBand, glitchFrame, 11.0))
  );
  float glitchOffset = (
    hash31(vec3(glitchFrame, glitchBand, 23.0)) - 0.5
  ) * 0.17 * glitchSlice * uGlitch;
  uv.x += glitchOffset;
  vec2 pull = (uPointer - 0.5) * vec2(0.035, -0.035);
  vec2 p = uv - pull;
  float speed = mix(1.0, 2.2, uLoading);
  float breathe = 1.0 + uLoading * 0.025 * sin(uTime * 4.2);
  float body = 0.35 * breathe;
  float minResolution = min(uResolution.x, uResolution.y);
  float pointPitch = 1.5 * uPixelRatio / minResolution;
  vec2 grid = p / pointPitch;
  vec2 cellId = floor(grid);
  vec2 jitter = (hash22(cellId) - 0.5) * 0.36;
  vec2 center = (cellId + 0.5 + jitter) * pointPitch;
  vec2 local = (p - center) / pointPitch;
  float centerRadius = length(center);
  float sphereDepth = sqrt(max(body * body - dot(center, center), 0.0));
  vec3 surface = vec3(center, sphereDepth);
  float rockX = sin(uTime * 0.31 * speed) * 0.16;
  float rockY = uTime * 0.12 * speed + sin(uTime * 0.19) * 0.18;
  vec3 rotatedSurface = rotateY(rockY) * rotateX(rockX) * surface;
  vec3 unitSurface = rotatedSurface / max(body, 0.001);
  vec3 pointId = floor(rotatedSurface / max(pointPitch, 0.0001) + 0.5);
  float random = hash31(pointId);
  float wave = sin(
    unitSurface.x * 10.0 +
    unitSurface.y * 13.0 -
    unitSurface.z * 7.0 +
    uTime * 0.62 * speed
  );
  float inside = 1.0 - smoothstep(body - pointPitch * 0.55, body + pointPitch * 0.1, centerRadius);
  float sphere = 1.0 - smoothstep(body - 0.006, body + 0.006, length(p));
  vec3 normal = normalize(vec3(center, sphereDepth));
  float keyLight = max(
    dot(normal, normalize(vec3(0.48, 0.58, 0.82))),
    0.0
  );
  float rimShadow = pow(1.0 - normal.z, 1.7);
  float lowerShadow = 1.0 - smoothstep(-0.55, 0.35, normal.y);
  float formShadow = clamp(
    (1.0 - keyLight) * 0.78 +
    rimShadow * 0.5 +
    lowerShadow * 0.12,
    0.0,
    1.0
  );
  float shadowTone = smoothstep(0.04, 0.82, formShadow);
  float stipple = mix(shadowTone, 1.0 - shadowTone, uDark);
  float keepThreshold = mix(0.28, 0.02, stipple);
  float keep = step(keepThreshold, random + wave * 0.07);
  float pointRadius = mix(0.25, 0.43, stipple);
  pointRadius *= 1.0 + uLoading * 0.08 * sin(uTime * 4.2);
  float antialias = 0.5 / max(1.5 * uPixelRatio, 1.0);
  float point = 1.0 - smoothstep(
    pointRadius - antialias,
    pointRadius + antialias,
    length(local)
  );
  float alpha = point * inside * keep;
  vec3 bodyColor = vec3(mix(0.16, 0.84, uDark));
  vec3 premul = bodyColor * alpha;

  float eyeRadius = body * 0.145;
  float eyeSpread = body * 0.28;
  float eyeLift = body * 0.15;
  float attention = smoothstep(0.02, 0.45, length(uLook));
  float idleYaw = sin(uTime * 0.33) * 0.13;
  float idlePitch = cos(uTime * 0.21) * 0.06;
  float yaw = (uLook.x * 0.5 + idleYaw * (1.0 - attention)) * uEyes;
  float pitch = (-uLook.y * 0.34 + idlePitch * (1.0 - attention)) * uEyes;
  float blinkCycle = fract(uTime * 0.14);
  float blink = smoothstep(0.0, 0.008, blinkCycle) * (1.0 - smoothstep(0.01, 0.028, blinkCycle));
  float openAmount = mix(1.0, 0.07, blink);
  vec3 leftEye = rotateOnSphere(placeOnSphere(vec2(-eyeSpread, eyeLift), body), yaw, pitch);
  vec3 rightEye = rotateOnSphere(placeOnSphere(vec2(eyeSpread, eyeLift), body), yaw, pitch);
  float eyes = max(
    sphereEye(p, leftEye, body, eyeRadius, openAmount),
    sphereEye(p, rightEye, body, eyeRadius, openAmount)
  );
  eyes *= uEyes * smoothstep(0.05, 0.5, sphere);
  vec3 eyeColor = vec3(1.0 - uDark);
  premul = eyeColor * eyes + premul * (1.0 - eyes);
  alpha = eyes + alpha * (1.0 - eyes);
  gl_FragColor = vec4(premul, alpha);
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

export const AssistantOrb = ({
  className,
  mode = 'icon',
  loading = false,
  followPointer = true,
  eyes = true,
}: AssistantOrbProps) => {
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
        console.error(gl.getShaderInfoLog(shader))
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
      console.error(gl.getProgramInfoLog(program))
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
    const lookUniform = gl.getUniformLocation(program, 'uLook')
    const time = gl.getUniformLocation(program, 'uTime')
    const dark = gl.getUniformLocation(program, 'uDark')
    const loadingUniform = gl.getUniformLocation(program, 'uLoading')
    const eyesUniform = gl.getUniformLocation(program, 'uEyes')
    const pixelRatioUniform = gl.getUniformLocation(program, 'uPixelRatio')
    const glitchUniform = gl.getUniformLocation(program, 'uGlitch')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const aim = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    const look = { x: 0, y: 0, tx: 0, ty: 0 }
    const glitchTimeouts: number[] = []
    let reduce = motion.matches
    let glitchIntensity = 0
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
      gl.uniform2f(lookUniform, look.x, look.y)
      gl.uniform1f(time, reduce ? 0 : now * 0.001)
      gl.uniform1f(dark, isDarkTheme() ? 1 : 0)
      gl.uniform1f(loadingUniform, loadingRef.current ? 1 : 0)
      gl.uniform1f(eyesUniform, eyes ? 1 : 0)
      gl.uniform1f(pixelRatioUniform, ratio)
      gl.uniform1f(glitchUniform, glitchIntensity)
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

    const handleLook = (event: PointerEvent) => {
      if (reduce) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width * 0.5)
      const dy = event.clientY - (rect.top + rect.height * 0.5)
      const dist = Math.hypot(dx, dy)

      if (dist < 1) {
        look.tx = 0
        look.ty = 0
        return
      }

      const reach = 220
      const mag = Math.min(1, dist / reach)
      look.tx = (dx / dist) * mag
      look.ty = (-dy / dist) * mag
    }

    const handleLookReset = () => {
      look.tx = 0
      look.ty = 0
    }

    const clearGlitchTimers = () => {
      glitchTimeouts.forEach((id) => window.clearTimeout(id))
      glitchTimeouts.length = 0
    }

    const stopGlitch = () => {
      clearGlitchTimers()
      glitchIntensity = 0
    }

    const scheduleGlitch = (callback: () => void, delay: number) => {
      glitchTimeouts.push(window.setTimeout(callback, delay))
    }

    const startGlitch = () => {
      if (mode !== 'icon' || reduce || !hover.matches) {
        return
      }

      clearGlitchTimers()
      glitchIntensity = GLITCH_BURST_INTENSITY
      scheduleGlitch(() => {
        glitchIntensity = 0
      }, GLITCH_BURST_MS)
      scheduleGlitch(() => {
        glitchIntensity = GLITCH_TAIL_INTENSITY
      }, GLITCH_BURST_MS + GLITCH_PAUSE_MS)
      scheduleGlitch(() => {
        glitchIntensity = 0
      }, GLITCH_BURST_MS + GLITCH_PAUSE_MS + GLITCH_TAIL_MS)
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.currentTarget as HTMLElement).matches(':focus-visible')) {
        return
      }

      startGlitch()
    }

    const handleMotion = () => {
      reduce = motion.matches

      if (reduce) {
        stopGlitch()
        aim.x = 0.5
        aim.y = 0.5
        aim.tx = 0.5
        aim.ty = 0.5
        look.x = 0
        look.y = 0
        look.tx = 0
        look.ty = 0
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
      const lookEase = mode === 'backdrop' ? 0.22 : 0.18
      look.x += (look.tx - look.x) * lookEase
      look.y += (look.ty - look.y) * lookEase
      draw(now)
    }

    if (followPointer) {
      track.addEventListener('pointermove', handleMove)
      track.addEventListener('pointerleave', handleLeave)
    }

    if (mode === 'icon') {
      track.addEventListener('mouseenter', startGlitch)
      track.addEventListener('mouseleave', stopGlitch)
      track.addEventListener('focusin', handleFocusIn)
      track.addEventListener('focusout', stopGlitch)
    }

    if (eyes) {
      window.addEventListener('pointermove', handleLook)
      document.documentElement.addEventListener('pointerleave', handleLookReset)
    }
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
      stopGlitch()
      if (followPointer) {
        track.removeEventListener('pointermove', handleMove)
        track.removeEventListener('pointerleave', handleLeave)
      }
      if (mode === 'icon') {
        track.removeEventListener('mouseenter', startGlitch)
        track.removeEventListener('mouseleave', stopGlitch)
        track.removeEventListener('focusin', handleFocusIn)
        track.removeEventListener('focusout', stopGlitch)
      }
      if (eyes) {
        window.removeEventListener('pointermove', handleLook)
        document.documentElement.removeEventListener('pointerleave', handleLookReset)
      }
      motion.removeEventListener('change', handleMotion)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      intersectionObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [eyes, followPointer, mode])

  if (fallback) {
    return (
      <div aria-hidden className={`relative overflow-hidden bg-transparent ${className ?? ''}`}>
        <div className="absolute top-1/2 left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,currentColor_0_0.45px,transparent_0.7px)] [background-size:1.5px_1.5px] text-black dark:text-white">
          {eyes ? (
            <>
              <div className="absolute top-[42%] left-[40%] size-[13%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-black" />
              <div className="absolute top-[42%] left-[60%] size-[13%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-black" />
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
