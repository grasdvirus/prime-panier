'use client';

import * as React from 'react';
import { useCallback, useRef, useState, useEffect, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Déclaration des types pour les événements de la souris
type MouseEvent = React.MouseEvent<HTMLButtonElement>;



interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
  className?: string;
  required?: boolean;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const ImageUpload = ({
  value,
  onChange,
  disabled = false,
  label = 'Téléverser une image',
  aspectRatio = 'square',
  className = '',
  required = false,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}: ImageUploadProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour l'aperçu lorsque la valeur change
  useEffect(() => {
    if (value && !preview) {
      setPreview(value);
    }
  }, [value, preview]);

  const processFile = useCallback((file: File) => {
    // Vérifier la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: `La taille maximale autorisée est de ${maxSizeMB}MB.`,
        variant: 'destructive',
      });
      return false;
    }

    // Vérifier le type de fichier
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier non supporté',
        description: `Formats acceptés: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  }, [allowedTypes, maxSizeMB, toast]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: Array<{ errors: Array<{ code: string; message: string }> }>) => {
    if (rejectedFiles.length > 0) {
      const { errors } = rejectedFiles[0];
      if (errors[0].code === 'file-too-large') {
        toast({
          title: 'Fichier trop volumineux',
          description: `La taille maximale autorisée est de ${maxSizeMB}MB.`,
          variant: 'destructive',
        });
      } else if (errors[0].code === 'file-invalid-type') {
        toast({
          title: 'Type de fichier non supporté',
          description: `Formats acceptés: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
          variant: 'destructive',
        });
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (!processFile(file)) return;

    setIsLoading(true);
    
    // Simuler un téléversement
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        toast({
          title: 'Erreur de lecture',
          description: 'Impossible de lire le fichier sélectionné.',
          variant: 'destructive',
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }, 500);
  }, [allowedTypes, maxSizeMB, onChange, processFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(allowedTypes.map(type => [type, []])) as unknown as Record<string, string[]>,
    disabled: disabled || isLoading,
    multiple: false,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url) {
      // Vérification basique de l'URL
      try {
        new URL(url);
        setPreview(url);
        onChange(url);
      } catch (err) {
        toast({
          title: 'URL invalide',
          description: 'Veuillez entrer une URL valide commençant par http:// ou https://',
          variant: 'destructive',
        });
      }
    } else {
      setPreview(null);
      onChange('');
    }
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[16/9]',
  }[aspectRatio];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isLoading}
              className="text-destructive hover:text-destructive/80 h-6 px-2 text-xs"
            >
              Supprimer
            </Button>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className={`${aspectRatioClass} flex items-center justify-center bg-muted/50 rounded-md`}>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : preview ? (
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleButtonClick}
        >
          <div className={`${aspectRatioClass} rounded-md overflow-hidden border bg-muted/25`}>
            <img 
              src={preview} 
              alt="Aperçu" 
              className="w-full h-full object-cover"
              onError={() => {
                setPreview(null);
                toast({
                  title: 'Erreur de chargement',
                  description: 'Impossible de charger l\'image à partir de cette URL.',
                  variant: 'destructive',
                });
              }}
            />
          </div>
          <div 
            className={cn(
              'absolute inset-0 bg-black/50 flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'flex-col gap-2 text-white p-4 text-center',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Upload className="h-6 w-6" />
            <p className="text-sm">Cliquez pour changer d'image</p>
            <p className="text-xs opacity-75">Glissez-déposez ou cliquez pour téléverser</p>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center',
            'cursor-pointer transition-colors',
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed',
            'flex flex-col items-center justify-center',
            aspectRatio === 'banner' ? 'min-h-[120px]' : 'min-h-[200px]'
          )}
        >
          <input 
            {...getInputProps()} 
            ref={fileInputRef}
            required={required && !preview}
          />
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? 'Déposez votre image ici' : 'Glissez-déposez votre image'}
              </p>
              <p className="text-xs text-muted-foreground">
                ou cliquez pour sélectionner
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {allowedTypes.map(t => t.split('/')[1]).join(', ').toUpperCase()} (max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <Input
          type="url"
          placeholder="Ou collez une URL d'image"
          value={value}
          onChange={handleInputChange}
          disabled={disabled || isLoading}
          className={cn(
            'mt-2 pr-10',
            'transition-colors',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-right'
          )}
          dir="ltr"
          required={required && !preview}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'absolute right-0 top-0 h-full px-3',
              'text-muted-foreground hover:text-destructive',
              'transition-colors',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onClick={handleRemove}
            disabled={disabled || isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      <div
        className={cn(
          'relative w-full rounded-lg border bg-muted/50 overflow-hidden flex items-center justify-center transition-all',
          aspectRatioClass,
          value ? 'min-h-[200px]' : 'min-h-[150px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Aperçu"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />

            {(isHovered || isLoading) && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 p-4 text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                    <p className="text-white/90 text-sm">Téléversement en cours...</p>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white text-foreground"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Changer l'image
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Aucune image sélectionnée
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isLoading}
              className="border-dashed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Téléverser une image
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG, WEBP (max. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
