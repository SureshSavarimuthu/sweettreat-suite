import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6">
          <Construction className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          This section is under development. We're working hard to bring you this feature soon!
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </motion.div>
    </MainLayout>
  );
}
