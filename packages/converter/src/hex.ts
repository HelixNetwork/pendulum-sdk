import * as errors from './errors'

export function hex(uint8arr: Uint8Array): string {
	if (!uint8arr) {
		return ''
	}
	let hexStr = ''
	for (let i = 0; i < uint8arr.length; i++) {
		let hexs = (uint8arr[i] & 0xff).toString(16)
		hexs = hexs.length === 1 ? '0' + hexs : hexs
		hexStr += hexs
	}
	return hexStr
}

export function bytes(str: string): Uint8Array {
	let b: any = []
	let len = str.length
	for (let i = 0; i < len; i += 2) {
	    b.push(parseInt(str.substr(i, 2), 16))
	}
	  return new Uint8Array(b)
}
