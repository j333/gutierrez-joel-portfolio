import { buildLlmsFullTxt, markdownResponse } from 'app/lib/llms'

export const dynamic = 'force-static'

export const GET = async () => markdownResponse(buildLlmsFullTxt())
