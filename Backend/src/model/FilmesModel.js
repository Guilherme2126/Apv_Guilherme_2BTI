import prisma from "../config/prisma";

export function criarFilme(nome, genero) {
    return prisma.filme.create({
        data: {
            nome,
            genero,
        },
    });
}

export function listarFilmes() {
    return prisma.filme.findMany ({
    orderBy: {
        id: 'asc',
    }
});
}