'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const { url } = await res.json();
      onChange(url);
      toast({
        title: 'Succès',
        description: 'Image téléversée avec succès.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: `Échec du téléversement de l'image: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="URL de l'image ou téléverser"
                className="flex-grow"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                <span className="sr-only">Téléverser une image</span>
            </Button>
            {value && (
                 <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => onChange('')}
                >
                    <X />
                    <span className="sr-only">Supprimer l'image</span>
                </Button>
            )}
        </div>
        <div className="relative w-full h-40 rounded-md border bg-muted/50 overflow-hidden flex items-center justify-center">
            {value ? (
                <>
                    <Image 
                        src={value} 
                        alt="Aperçu de l'image" 
                        fill
                        className="object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // transparent 1x1 pixel
                            target.srcset = "";
                            target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                    />
                    <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center -z-10">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
        </div>
    </div>
  );
}
