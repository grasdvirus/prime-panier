
'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const MAX_SIZE_MB = 10;

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

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
      // Créer une référence de stockage unique
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, '_')}`;
      const storageRef = ref(storage, `uploads/${filename}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Optionnel: Gérer la progression de l'upload ici
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.error("Firebase Upload Error:", error);
          let errorMessage = "Une erreur inconnue est survenue.";
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = "Vous n'avez pas la permission de téléverser des fichiers. Vérifiez les règles de sécurité de Firebase Storage.";
              break;
            case 'storage/canceled':
              errorMessage = "Le téléversement a été annulé.";
              break;
            case 'storage/unknown':
              errorMessage = "Une erreur inconnue est survenue, vérifiez votre connexion internet.";
              break;
          }
          toast({ title: 'Erreur de téléversement', description: errorMessage, variant: 'destructive' });
          setIsUploading(false);
        }, 
        () => {
          // Téléversement réussi
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onChange(downloadURL);
            toast({ title: 'Succès', description: 'Image téléversée.' });
            setIsUploading(false);
          });
        }
      );

    } catch (e: any) {
      toast({ title: 'Erreur inattendue', description: e.message, variant: 'destructive' });
      setIsUploading(false);
    }
  }, [onChange, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      handleUpload(acceptedFiles[0]);
    }
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: disabled || isUploading,
  });

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onChange('');
  };

  return (
    <div className="flex flex-col gap-2">
      <div 
        {...getRootProps()}
        className={cn(
            'relative group w-full aspect-square rounded-md border-2 border-dashed bg-muted/25 flex items-center justify-center text-center p-4 transition-colors cursor-pointer',
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
                    className="object-contain rounded-md"
                />
                <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={handleRemoveImage}
                    aria-label="Supprimer l'image"
                    disabled={disabled || isUploading}
                >
                    <X className="h-4 w-4" />
                </Button>
            </>
        ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Glissez-déposez ou cliquez</p>
                <p className="text-xs">Taille max: {MAX_SIZE_MB}MB</p>
            </div>
        )}
      </div>
      <div className="flex items-center gap-2">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ou collez une URL d'image ici"
                className="flex-grow"
                disabled={disabled || isUploading}
            />
             <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveImage}
                disabled={!value || disabled || isUploading}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Supprimer l'image</span>
            </Button>
      </div>
    </div>
  );
}
