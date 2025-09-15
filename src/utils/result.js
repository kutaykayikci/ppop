// Result helper
export const Ok = (value) => ({ ok: true, value })
export const Err = (error) => ({ ok: false, error })

export const tryAsync = async (fn) => {
  try { return Ok(await fn()) } catch (e) { return Err(e) }
}


