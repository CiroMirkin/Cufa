import { Link } from "@tanstack/react-router"
import { useSubjects } from "@/hooks/useSubjects"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

function Home() {
    const { data: subjects, isLoading, error } = useSubjects()

    return (
        <div className="px-6">
            <header className="w-full py-4 flex justify-center items-center">
                <h1 className="font-semibold text-3xl">Carrera</h1>
            </header>

            <main className="pt-4 flex gap-6 flex-wrap justify-center">
                {isLoading && <p className="text-gray-500">Cargando materias...</p>}
                {error && <p className="text-red-500">Error al cargar las materias.</p>}
                {subjects?.map((subject) => (
                    <Link
                        key={subject.id}
                        to='/subject/$subject-id'
                        params={{ 'subject-id': subject.id }}
                        className="block w-64"
                    >
                        <Card className="hover:bg-emerald-100 transition-colors ease-in-out duration-100">
                            <CardHeader>
                                <CardTitle>{subject.name}</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </main>
        </div>
    )
}

export default Home
