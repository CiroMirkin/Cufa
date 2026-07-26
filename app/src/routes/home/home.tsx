import { Link } from "@tanstack/react-router"
import { useSubjects } from "@/hooks/useSubjects"

function Home() {
    const { data: subjects, isLoading, error } = useSubjects()

    return (
        <div className="px-6">
            <header className="w-full py-4 flex justify-center items-center">
                <h1 className="font-semibold text-3xl">Carrera</h1>
            </header>
            <main className="pt-4 flex gap-6 flex-wrap justify-center list-none">
                {isLoading && <p className="text-gray-500">Cargando materias...</p>}
                {error && <p className="text-red-500">Error al cargar las materias.</p>}
                {subjects?.map((subject) => (
                    <Link
                        key={subject.id}
                        to="/subject/$subjectId"
                        params={{ subjectId: subject.id }}
                        className="px-8 py-4 rounded text-xl bg-green-100 hover:bg-green-200 shadow-sm"
                    >
                        {subject.name}
                    </Link>
                ))}
            </main>
        </div>
    )
}

export default Home
