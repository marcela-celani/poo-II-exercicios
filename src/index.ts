import express, { Request, Response } from 'express'
import cors from 'cors'
import { Video } from './database/Video'
import { VideoDatabase } from './database/VideoDatabase'
import { TVideos } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

// app.get("/ping", async (req: Request, res: Response) => {
//     try {
//         res.status(200).send({ message: "Pong!" })
//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })

app.get("/videos", async (req: Request, res: Response) => {
    try {

        // const result: TVideos[] = await db('videos')

        const videoDatabase = new VideoDatabase()
        const videoDB = await videoDatabase.getVideos()

        const video = videoDB.map((videoDB: any | undefined) => new Video(
            videoDB.id,
            videoDB.titulo,
            videoDB.duracao,
            videoDB.data_upload
        ))

        res.status(200).send(video)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {

        const { id, titulo, duracao } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof titulo !== "string") {
            res.status(400)
            throw new Error("'titulo' deve ser string")
        }

        if (typeof duracao !== "number") {
            res.status(400)
            throw new Error("'duracao' deve ser number")
        }

        const videoDatabase = new VideoDatabase()
        const videoDBId = await videoDatabase.getVideoById(id)
        
        // const [ videoDbExists ]: TVideos[] | undefined[] = await db('videos').where({id})

        if(videoDBId){
            res.status(400)
            throw new Error("'id' já existe")
        }

        const video = new Video (
            id,
            titulo,
            duracao,
            new Date().toISOString()
        )

        const newVideo: TVideos = {
            id: video.getId(),
            titulo: video.getTitulo(),
            duracao: video.getDuracao(),
            data_upload: video.getDataUpload()
        }

        // await db('videos').insert(newVideo)
        // const [ videoDB ]: TVideos[] = await db('videos').where({ id })

        await videoDatabase.insertVideo(newVideo)

        res.status(200).send({message: "Video cadastrado com sucesso", video})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const titulo = req.body.titulo
        const duracao = req.body.duracao


        if (typeof idToEdit !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        const videoDatabase = new VideoDatabase()
        const videoDB = await videoDatabase.getVideoById(idToEdit)

        if (!videoDB) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        const video = new Video(
            videoDB.id,
            videoDB.titulo,
            videoDB.duracao,
            videoDB.data_upload
        )

        titulo && video.setTitulo(titulo)
        duracao && video.setDuracao(duracao)

        const newVideo: TVideos = {
            id: video.getId(),
            titulo: video.getTitulo(),
            duracao: video.getDuracao(),
            data_upload: video.getDataUpload()
        }

        await videoDatabase.updateVideo(newVideo, idToEdit)
        
        res.status(200).send(video)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (typeof idToDelete !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        const videoDatabase = new VideoDatabase()
        const videoDB = await videoDatabase.getVideoById(idToDelete)

        if (!videoDB) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        const video = new Video(
            videoDB.id,
            videoDB.titulo,
            videoDB.duracao,
            videoDB.data_upload
        )

        const newVideo: TVideos = {
            id: video.getId(),
            titulo: video.getTitulo(),
            duracao: video.getDuracao(),
            data_upload: video.getDataUpload()
        }

        await videoDatabase.deleteVideo(newVideo, idToDelete)
        
        res.status(200).send(video)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})