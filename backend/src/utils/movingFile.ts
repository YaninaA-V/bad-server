import { existsSync, rename, statSync } from 'fs'
import { basename, join, normalize, resolve } from 'path'

function movingFile(imagePath: string, from: string, to: string) {
    const safeFrom = resolve(normalize(from))
    const safeTo = resolve(normalize(to))

     const allowedBase = resolve(process.cwd(), 'public')
    if (!safeFrom.startsWith(allowedBase) || !safeTo.startsWith(allowedBase)) {
        throw new Error('Недопустимый путь к файлу')
    }

    const fileName = basename(imagePath)
    const imagePathTemp = join(from, fileName)
    const imagePathPermanent = join(to, fileName)
    if (!imagePathTemp.startsWith(safeFrom) || !imagePathPermanent.startsWith(safeTo)) {
        throw new Error('Попытка обхода директории')
    }
    if (!existsSync(imagePathTemp)) {
        throw new Error('Ошибка при сохранении файла')
    }

    const stats = statSync(imagePathTemp)
    const MAX_FILE_SIZE = 10 * 1024 * 1024

    if (stats.size > MAX_FILE_SIZE) {
        throw new Error(`Размер файла превышает ${MAX_FILE_SIZE} байт`)
    }

    rename(imagePathTemp, imagePathPermanent, (err) => {
        if (err) {
            throw new Error('Ошибка при сохранении файла')
        }
    })
}

export default movingFile
