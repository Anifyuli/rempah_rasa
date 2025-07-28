export default function AboutPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-white px-6 py-12">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-cyan-800">
          Tentang Rempah Rasa
        </h1>

        <p className="mb-4 text-gray-700">
          Selamat datang di <strong>Rempah Rasa</strong> — sebuah ruang digital
          bagi siapa saja yang ingin berbagi, mencoba, dan merayakan
          keanekaragaman kuliner Indonesia dan dunia.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-cyan-700">
          Apa itu Rempah Rasa?
        </h2>
        <p className="mb-4 text-gray-700">
          Rempah Rasa adalah platform terbuka untuk berbagi resep makanan,
          minuman, camilan, hingga tips memasak. Kami hadir untuk mempertemukan
          para pecinta masak-memasak — baik pemula maupun ahli — dalam satu
          komunitas yang saling menginspirasi.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-cyan-700">Misi Kami</h2>
        <p className="mb-4 text-gray-700">
          Kami percaya bahwa setiap orang punya cerita dan cita rasa unik. Misi
          kami adalah menjaga warisan kuliner, memperkenalkan kreasi baru, dan
          menjembatani jarak lewat masakan dari berbagai latar belakang.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-cyan-700">
          Kenapa Harus Rempah Rasa?
        </h2>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Ribuan resep menarik dari komunitas aktif</li>
          <li>Dukungan berbagai kategori kuliner</li>
          <li>Komentar & ulasan dari pengguna lain</li>
          <li>Pencarian mudah dan cepat</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-cyan-700">
          Ayo Bergabung!
        </h2>
        <p className="mb-4 text-gray-700">
          Kamu punya resep andalan keluarga? Atau kreasi unik dari eksperimen
          dapurmu sendiri? Bagikan di Rempah Rasa dan temukan pembaca yang siap
          mencoba masakanmu!
        </p>

        <p className="italic text-cyan-700">
          Mari tumbuhkan komunitas kuliner yang hangat dan saling mendukung.
          Rempah Rasa, tempat di mana masakan menjadi cerita.
        </p>
      </div>
    </div>
  );
}
