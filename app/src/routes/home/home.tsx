import { Link } from "@tanstack/react-router"

function Home() {
    return (
        <div className="px-6">
            <header className="w-full py-4 flex justify-center items-center">
                <h1 className="font-semibold text-3xl">Carrera</h1>
            </header>
            <main className="pt-4 flex gap-6 flex-wrap justify-center list-none">
                <Link
                    to="/subject/$subjectName"
                    params={{ subjectName: "Analisis sistemico" }}
                    className="px-8 py-4 rounded text-xl bg-green-100 hover:bg-green-200 shadow-sm"
                >
                    Analisis sistemico
                </Link>
            </main>
        </div>
    )
}

export default Home
