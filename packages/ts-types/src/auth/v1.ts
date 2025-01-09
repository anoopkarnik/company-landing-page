//Base Interfaces for Auth Components

export interface QuoteProps {
    quote: string,
    author: string,
    credential: string
}

export interface DataResultProps {
    success?: string | undefined;
    error?: string | undefined;
}


export interface LoadingCardProps {
    title: string;
    description: string;
}


export interface FormResultProps{
    type: 'error' | 'success',
    message?: string;
}

//IC Interfaces for Auth Components
export interface LoginCardProps {
    showEmail?: boolean;
    showGoogleProvider?: boolean;
    showGithubProvider?: boolean;
    showLinkedinProvider?: boolean;
    onEmailSubmit?: any;
    onGoogleProviderSubmit?: any;
    onGithubProviderSubmit?: any;
    onLinkedinProviderSubmit?: any;
    forgotPasswordFunction?: any;
    backFunction?:()=>void;
    errorMessage?:string;
  }
  

export interface RegisterCardProps {
    showEmail?: boolean;
    showGoogleProvider?: boolean;
    showGithubProvider?: boolean;
    showLinkedinProvider?: boolean;
    onEmailSubmit?: any;
    onGoogleProviderSubmit?: any;
    onGithubProviderSubmit?: any;
    onLinkedinProviderSubmit?: any;
    backFunction?:() => void;
    errorMessage?:string;
  }

export interface VerificationCardProps {
    errorMessage?:string;  
    successMessage?:string;
    token?: string;
    backFunction?:() => void;
    resetFunction?:any;
}

export interface ResetPasswordCardProps {
    errorMessage?:string;  
    successMessage?:string;
    token?: string;
    backFunction?:() => void;
    resetFunction?:any;
}



export interface ForgotPasswordCardProps {
    errorMessage?:string;  
    successMessage?:string;
    resetFunction?:any; 
    backFunction?:() => void;
  }

 export interface ErrorCardProps {
    errorMessage?:string;
    backFunction?:any
  }

//Complex Interfaces for Auth Pages

export interface LoginPageProps extends LoginCardProps,QuoteProps,LoadingCardProps{

}

export interface RegisterPageProps extends RegisterCardProps,QuoteProps,LoadingCardProps{

}

export interface ErrorPageProps extends ErrorCardProps,QuoteProps{
}

export interface ForgotPasswordPageProps extends ForgotPasswordCardProps,QuoteProps,LoadingCardProps{
}

export interface VerificationPageProps extends VerificationCardProps,QuoteProps,LoadingCardProps{
}

export interface ResetPasswordPageProps extends ResetPasswordCardProps,QuoteProps,LoadingCardProps{
}
