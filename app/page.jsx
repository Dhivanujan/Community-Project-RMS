import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomepageContent from '@/components/home/HomepageContent';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomepageContent />
      </main>
      <Footer />
    </>
  );
}
