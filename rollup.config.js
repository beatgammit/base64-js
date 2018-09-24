import { terser } from 'rollup-plugin-terser'

function getConfig ({ format = 'umd', min = false }) {
  return {
    input: 'index.js',
    plugins: [
      min ? terser() : undefined
    ],
    output: {
      format,
      file: `base64js${format === 'es' ? '-es' : ''}${min ? '.min' : ''}.js`,
      name: 'base64js'
    }
  }
}

export default [
  getConfig({ format: 'umd', min: true }),
  getConfig({ format: 'umd', min: false }),
  getConfig({ format: 'es', min: true }),
  getConfig({ format: 'es', min: false })
]
