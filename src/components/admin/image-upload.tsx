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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_SIZE_MB = 5;

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: `La taille maximale autorisée est de ${MAX_SIZE_MB}MB.`,
        variant: 'destructive',
      });
      return;
    }

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
      <div 
        {...getRootProps()}
        className={cn(
            'relative w-full aspect-square rounded-md border-2 border-dashed bg-muted/25 flex items-center justify-center text-center p-4 transition-colors',
            isDragActive && 'border-primary bg-primary/10',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : value ? (
            <>
                <Image
                    src={value}
                    alt="Aperçu de l'image"
                    fill
                    className="object-contain"
                />
                <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveImage}
                    aria-label="Supprimer l'image"
                >
                    <X className="h-4 w-4" />
                </Button>
            </>
        ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Glissez-déposez ou cliquez</p>
                <p className="text-xs">pour téléverser une image.</p>
            </div>
        )}

      </div>
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
