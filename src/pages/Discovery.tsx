import APIDiscoverySection from '@/components/sections/APIDiscoverySection';

interface DiscoveryProps {
  onSectionChange: (section: string) => void;
}

const Discovery = ({ onSectionChange }: DiscoveryProps) => {
  return (
    <div className="pt-24">
      <APIDiscoverySection onSectionChange={onSectionChange} />
    </div>
  );
};

export default Discovery;